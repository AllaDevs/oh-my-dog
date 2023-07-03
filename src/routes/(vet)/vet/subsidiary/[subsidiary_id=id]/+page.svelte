<script lang="ts">
  import A from '$cmp/element/A.svelte';
  import Button from '$cmp/element/Button.svelte';
  import ActionButton from '$cmp/form/ActionButton.svelte';
  import FieldGroup from '$cmp/form/FieldGroup.svelte';
  import TextAreaInput from '$cmp/form/TextAreaInput.svelte';
  import TextInput from '$cmp/form/TextInput.svelte';
  import AutocomplePlace from '$cmp/google_maps/AutocomplePlace.svelte';
  import Map from '$cmp/google_maps/Map.svelte';
  import Page from '$cmp/layout/Page.svelte';
  import type { ComponentEvents } from 'svelte';
  import toast from 'svelte-french-toast';
  import { superForm } from 'sveltekit-superforms/client';

  export let data;

  const mapInitialOpts = {
    center: { lat: -34.92945, lng: -57.93453 },
    zoom: 12,
  };
  const [lat, lng] = data.form.data.location.split(', ');
  const initialLatLng = { lat: Number(lat), lng: Number(lng) };

  const updateSForm = superForm(data.form, {
    onSubmit(input) {
      if (!$form.location) {
        toast.error('La ubicacion ingresada es invalida, prueba con otra', {
          duration: 5000,
        });
        input.cancel();
      }
    },
    onError: (error) => {
      toast.error(String(error.message));
    },
    onUpdated: ({ form }) => {
      if (form.valid) {
        toast.success('Sucursal registrada con exito', { duration: 5000 });
      } else if (form.errors._errors) {
        toast.error(String(form.errors._errors), { duration: 10000 });
      }
    },
  });

  let form = updateSForm.form;
  let mapController: google.maps.Map;
  let initAutocomple: (map?: google.maps.Map) => Promise<void>;

  function onPlaceChange(
    e: ComponentEvents<AutocomplePlace<boolean>>['place_change']
  ) {
    const place = e.detail.place;
    // If place doesn't have geometry means it's not a valid place
    if (!place.geometry) {
      $form.location = '';
      return;
    }

    let newLocation = place.geometry.location!.toString();
    // map google map location to `${lat}, ${lng}` format
    $form.location = newLocation.replace('(', '').replace(')', '');
  }
</script>

<svelte:head>
  <title>Nueva sucursal</title>
</svelte:head>

<Page
  classContainer="container mx-auto max-w-screen-xl p-4 scrollbar"
  classHeaderSlot="flex flex-col w-full justify-between md:flex-row"
  classContentSlot="mt-2 px-4 relative text-gray-900 flex flex-col mb-8"
>
  <svelte:fragment slot="pageHeader">
    <h2 class=" mt-[1em] text-2xl md:text-3xl text-gray-900 font-semibold">
      Edicion de sucursal
    </h2>
    <div class="mt-2 mb-1 md:mt-0 md:self-end">
      <A href="/vet/subsidiary" color="default" button>
        Volver a las sucursales
      </A>
    </div>
  </svelte:fragment>

  <section
    class="mt-4 grid grid-rows-2 md:grid-rows-1 md:grid-cols-3 gap-4 md:gap-2 lg:gap-4 xl:gap-8 flex-1"
  >
    <div class="flex flex-col">
      <form
        method="POST"
        action="?/update"
        use:updateSForm.enhance
        class="flex-1"
      >
        <FieldGroup cols="1">
          <svelte:fragment slot="title">
            <h3 class=" text-xl font-semibold text-gray-900">
              Informacion de la sucursal
            </h3>
          </svelte:fragment>
          <svelte:fragment slot="fields">
            <TextInput label="Nombre" field="name" form={updateSForm} />
            <AutocomplePlace
              field="autocompletedAddress"
              label="Ubicacion"
              bind:value={$form.autocompletedAddress}
              {initialLatLng}
              required
              enableMarker
              centerOnInput
              bind:initAutocomple
              on:place_change={onPlaceChange}
            />
            <TextInput
              label="Descripcion sobre la ubicacion (breve)"
              field="address"
              form={updateSForm}
            />
            <TextAreaInput
              label="Horarios"
              field="workHours"
              form={updateSForm}
            />
            <div class="hidden">
              <TextInput
                label="Ubicación"
                field="location"
                form={updateSForm}
                required={false}
              />
            </div>
          </svelte:fragment>
          <svelte:fragment slot="actions">
            <Button type="submit" color="primary">Actualizar sucursal</Button>
          </svelte:fragment>
        </FieldGroup>
      </form>
      <ActionButton class="p-0 md:p-0" color="error" action="?/delete">
        Eliminar sucursal
      </ActionButton>
    </div>

    <div
      class="col-span-1 row-span-1 md:row-span-1 md:col-span-2 relative flex flex-col"
    >
      <Map
        initialOpts={mapInitialOpts}
        bind:mapController
        on:initialized={(e) => initAutocomple(e.detail.mapController)}
      />
    </div>
  </section>
</Page>
