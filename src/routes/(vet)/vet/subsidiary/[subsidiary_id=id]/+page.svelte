<script lang="ts">
  import Button from '$cmp/element/Button.svelte';
  import ActionButton from '$cmp/form/ActionButton.svelte';
  import FieldGroup from '$cmp/form/FieldGroup.svelte';
  import TextInput from '$cmp/form/TextInput.svelte';
  import Page from '$cmp/layout/Page.svelte';
  import WorkingHourRegisterCard from '$cmp/vet/WorkingHourRegisterCard.svelte';
  import { fieldValueCloner } from '$lib/utils/functions.js';
  import { onMount } from 'svelte';
  import toast from 'svelte-french-toast';
  import { superForm } from 'sveltekit-superforms/client';
  export let data;

  // enhanced
  const registerSForm = superForm(data.form, {
    dataType: 'json',
    onError: (error) => {
      toast.error(String(error.message));
    },
    onUpdated: ({ form }) => {
      if (form.valid) {
        toast.success('Sucursal actualizada con exito', { duration: 5000 });
      } else if (form.errors._errors) {
        toast.error(String(form.errors._errors), { duration: 10000 });
      }
    },
  });
  const { form: registerData, errors } = registerSForm;

  const cloneHourDefault = fieldValueCloner($registerData, ['workingHour', 0]);

  function addWorkingHour() {
    $registerData.workingHour.push(cloneHourDefault());
    $registerData.workingHour = $registerData.workingHour;
  }

  function removeWorkingHour(index: number) {
    $registerData.workingHour.splice(index, 1);
    $registerData.workingHour = $registerData.workingHour;
  }

  let actualInput: HTMLInputElement;
  let card: HTMLDivElement;
  let container: HTMLDivElement;
  let map: google.maps.Map;
  let zoom = 13;
  let center = { lat: -34.92945, lng: -57.93453 };
  let lastLoc: string;
  let mounted = false;

  onMount(() => {
    mounted = true;
  });

  $: if (mounted && google) initMap();

  function initMap() {
    map = new google.maps.Map(container, {
      zoom,
      center,
    });
    // Make the search bar into a Places Autocomplete search bar and select
    // which detail fields should be returned about the place that
    // the user selects from the suggestions.
    const autocomplete = new google.maps.places.Autocomplete(actualInput, {
      types: ['address'],
      componentRestrictions: { country: 'ar' },
    });

    autocomplete.setFields(['address_components', 'geometry', 'name']);

    // Set the origin point when the user selects an address
    const originMarker = new google.maps.Marker({
      map: map,
    });
    originMarker.setVisible(false);
    let originLocation = map.getCenter();

    let oldLatLng = new google.maps.LatLng({
      lat: data.oldSubsidiary.location.latitude,
      lng: data.oldSubsidiary.location.longitude,
    });
    map.setCenter(oldLatLng);
    lastLoc = oldLatLng.toString();
    originLocation = oldLatLng;
    map.setCenter(oldLatLng);
    map.setZoom(14);
    originMarker.setPosition(oldLatLng);
    originMarker.setVisible(true);

    autocomplete.addListener('place_changed', async () => {
      originMarker.setVisible(false);
      originLocation = map.getCenter();
      const place = autocomplete.getPlace();

      if (!place.geometry) {
        // User entered the name of a Place that was not suggested and
        // pressed the Enter key, or the Place Details request failed.
        window.alert("No existe la ubicación: '" + place.name + "'");
        return;
      }

      // Recenter the map to the selected address
      originLocation = place.geometry.location!;
      lastLoc = originLocation.toString();
      map.setCenter(originLocation);
      map.setZoom(14);
      console.log(place);

      originMarker.setPosition(originLocation);
      originMarker.setVisible(true);

      return;
    });
  }

  let form = registerSForm.form;
  $: $form.location = lastLoc?.replace('(', '').replace(')', '');
</script>

<svelte:head>
  <title>Nueva sucursal</title>
</svelte:head>

<Page>
  <div class="mt-10 mb-3 ml-12">
    <h3 class="text-3xl font-semibold text-gray-900">Registro de Sucursal</h3>
  </div>

  <main class=" container flex flex-col gap-4 p-4 lg:max-w-screen-lg mx-auto">
    <form
      method="POST"
      class=" mt-2 py-4"
      enctype="multipart/form-data"
      use:registerSForm.enhance
    >
      <div class="mt-6">
        <h3 class="text-xl font-semibold text-gray-900">
          Seleccione la ubicación de la sucursal
        </h3>
        <div class="h-[50vh] w-[52.7vw] mt-7 mb-7" bind:this={container} />
      </div>
      <div class=" pb-4 flex flex-col gap-4">
        <FieldGroup cols="2">
          <svelte:fragment slot="title">
            <h3 class=" text-xl font-semibold text-gray-900">
              {'Nueva sucursal'}
            </h3>
          </svelte:fragment>
          <svelte:fragment slot="fields">
            <TextInput
              label="Nombre"
              field="name"
              unselectedLabel="Ingrese la calle"
              form={registerSForm}
            />
            <TextInput
              label="Dirección detallada"
              field="address"
              hint="Descripción breve"
              unselectedLabel="Ingrese la dirección"
              form={registerSForm}
            />
            <input
              bind:this={actualInput}
              type="text"
              id="pac-input"
              name="pac-input"
              placeholder="Dirección en el mapa"
              class=" mt-2 block w-full rounded-md border-none py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6"
            />
            <div class="hidden">
              <TextInput
                label="Ubicación"
                field="location"
                form={registerSForm}
              />
            </div>
          </svelte:fragment>
          <svelte:fragment slot="actions" />
        </FieldGroup>
        {#each $registerData.workingHour as _, i}
          <WorkingHourRegisterCard
            sForm={registerSForm}
            index={i}
            title="Nueva franja {$registerData.workingHour.length > 1
              ? i + 1
              : ''}"
            allowRemoval={i > 0}
            on:remove={() => removeWorkingHour(i)}
          />
        {/each}
      </div>
      <div class="mt-6 flex items-center justify-around">
        <Button on:click={addWorkingHour} color="primary">
          Agregar otra franja horaria
        </Button>
        <ActionButton class="p-0 md:p-0" color="error" action="?/delete"
          >Eliminar</ActionButton
        >
        <Button type="submit" formaction="?/update" color="primary">
          Actualizar sucursal
        </Button>
      </div>
    </form>
  </main>
</Page>
