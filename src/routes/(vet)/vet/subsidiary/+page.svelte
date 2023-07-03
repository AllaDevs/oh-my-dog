<script lang="ts">
  import A from '$cmp/element/A.svelte';
  import Map from '$cmp/google_maps/Map.svelte';
  import Page from '$cmp/layout/Page.svelte';
  import SubsidiaryCardPreview from '$cmp/subsidiary/SubsidiaryCardPreview.svelte';
  import { subsidiariesToMarks } from '$lib/utils/functions.js';
  import type { ComponentEvents } from 'svelte';

  export let data;

  const mapInitialOpts = {
    center: { lat: -34.92945, lng: -57.93453 },
    zoom: 12,
  };

  let marks = subsidiariesToMarks(data.subsidiaries);

  let mapController: google.maps.Map;

  function relocate(e: ComponentEvents<SubsidiaryCardPreview>['relocate']) {
    const id = e.detail;
    const subsidiary = data.subsidiaries.find((s) => s.id === id);
    if (!subsidiary) {
      return console.error('No se encontro la sucursal');
    }

    mapController.setCenter({
      lat: subsidiary.location.latitude,
      lng: subsidiary.location.longitude,
    });
    mapController.setZoom(15);
  }
</script>

<svelte:head>
  <title>Sucursales</title>
</svelte:head>

<Page
  classContainer="container mx-auto max-w-screen-xl p-4 "
  classHeaderSlot="flex w-full justify-between"
  classContentSlot="mt-2 px-4 relative text-gray-900 flex flex-col mb-8 overflow-y-hidden"
>
  <svelte:fragment slot="pageHeader">
    <h2 class=" mt-[1em] text-2xl md:text-3xl text-gray-900 font-semibold">
      Sucursales
    </h2>
    <div class=" mb-1 self-end">
      <A href="/vet/subsidiary/new" color="primary" button>Nueva sucursal</A>
    </div>
  </svelte:fragment>

  <section
    class="mt-4 grid grid-rows-3 md:grid-rows-1 md:grid-cols-3 gap-4 md:gap-0 lg:gap-4 flex-1 overflow-y-hidden"
  >
    <div
      class="col-span-1 row-span-2 md:row-span-1 md:col-span-2 relative flex flex-col"
    >
      <Map initialOpts={mapInitialOpts} {marks} bind:mapController />
    </div>

    <div class="flex-1 flex flex-col overflow-y-hidden scrollbar">
      <ul
        class="flex md:grid gap-4 mb-auto overflow-y-auto scrollbar py-4 md:py-0 px-4"
      >
        {#each data.subsidiaries as subsidiary}
          <li class=" min-w-max h-max">
            <SubsidiaryCardPreview
              {subsidiary}
              editable
              on:relocate={relocate}
            />
          </li>
        {:else}
          <li class="h-max">
            <p class=" font-medium text-gray-700" style:text-wrap="balance">
              No hay sucursales para mostrar en este momento.
            </p>
          </li>
        {/each}
      </ul>
    </div>
  </section>
</Page>
