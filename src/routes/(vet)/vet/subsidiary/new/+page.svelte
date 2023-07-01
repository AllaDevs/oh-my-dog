<script lang="ts">
  import Button from '$cmp/element/Button.svelte';
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

  const initialCoords = { lat: -34.92945, lng: -57.93453 };

  const registerSForm = superForm(data.form, {
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

  let form = registerSForm.form;
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
  classContentSlot="mt-2 px-4 relative text-gray-900 flex flex-col mb-8"
>
  <svelte:fragment slot="pageHeader">
    <h2 class=" mt-[1em] text-2xl md:text-3xl text-gray-900 font-bold">
      Registro de sucursal
    </h2>
  </svelte:fragment>

  <section
    class="mt-4 grid grid-rows-3 md:grid-rows-1 md:grid-cols-3 gap-4 md:gap-2 lg:gap-4 xl:gap-8 flex-1"
  >
    <form method="POST" action="?/register" use:registerSForm.enhance>
      <FieldGroup cols="1">
        <svelte:fragment slot="title">
          <h3 class=" text-xl font-semibold text-gray-900">
            Informacion de la sucursal
          </h3>
        </svelte:fragment>
        <svelte:fragment slot="fields">
          <TextInput label="Nombre" field="name" form={registerSForm} />
          <AutocomplePlace
            field="pac-input"
            label="Ubicacion"
            value=""
            required
            enableMarker
            bind:initAutocomple
            on:place_change={onPlaceChange}
          />
          <TextInput
            label="Descripcion sobre la ubicacion (breve)"
            field="address"
            form={registerSForm}
          />
          <TextAreaInput
            label="Horarios"
            field="workHours"
            form={registerSForm}
          />
          <div class="hidden">
            <TextInput
              label="Ubicación"
              field="location"
              form={registerSForm}
              required={false}
            />
          </div>
        </svelte:fragment>
        <svelte:fragment slot="actions">
          <Button type="submit" color="primary">Registrar sucursal</Button>
        </svelte:fragment>
      </FieldGroup>
    </form>

    <div
      class="col-span-1 row-span-2 md:row-span-1 md:col-span-2 relative flex flex-col"
    >
      <Map
        initialCenter={initialCoords}
        bind:mapController
        on:initialized={(e) => initAutocomple(e.detail.mapController)}
      />
    </div>
  </section>
</Page>
