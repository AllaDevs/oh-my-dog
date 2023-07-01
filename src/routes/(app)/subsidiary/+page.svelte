<script lang="ts">
  import { beforeNavigate } from '$app/navigation';
  import { page } from '$app/stores';
  import Button from '$cmp/element/Button.svelte';
  import Map from '$cmp/google_maps/Map.svelte';
  import Page from '$cmp/layout/Page.svelte';
  import SubsidiaryCardPreview from '$cmp/subsidiary/SubsidiaryCardPreview.svelte';
  import { subsidiariesToMarks } from '$lib/utils/functions.js';
  import { fade, fly } from 'svelte/transition';

  export let data;

  const initialCenter = { lat: -34.92945, lng: -57.93453 };

  let marks = subsidiariesToMarks(data.subsidiaries);

  let mapController: google.maps.Map;

  function relocate(e: CustomEvent<string>) {
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

  let showUrgencyMessage =
    $page.url.searchParams.get('urgencyMessage') === 'true';

  function closeUrgencyMessage() {
    showUrgencyMessage = false;
    $page.url.searchParams.delete('urgencyMessage');
    history.replaceState({}, '', $page.url);
  }

  beforeNavigate((navigation) => {
    showUrgencyMessage =
      navigation.to?.url.searchParams.get('urgencyMessage') === 'true';
  });
</script>

<svelte:head>
  <title>OhMyDog | Sucursales</title>
</svelte:head>

{#if showUrgencyMessage}
  <div
    out:fade={{ duration: 500 }}
    class="absolute z-10 w-full m-auto h-[100svh] overflow-hidden grid place-items-center -mt-[3.5rem] md:-mt-[4rem] bg-teal-900/75"
  >
    <div
      transition:fly={{ duration: 500, y: 500 }}
      style:text-wrap="balance"
      class="mx-4 py-8 border border-gray-900 flex flex-col items-center justify-between rounded bg-red-500 text-center px-[2.5%]"
    >
      <h1 class="p-4 text-2xl font-bold text-white">URGENCIA</h1>
      <p class="text-lg text-gray-100 mt-[1em] max-w-md">
        Si tenés una urgencia, podés acudir a cualquiera de nuestras sucursales
        sin turno ni aviso previo.
      </p>
      <p class="text-lg text-gray-100 my-[1em]">
        Para verlas consulta nuestro
        <Button color="default" on:click={closeUrgencyMessage}>mapa</Button>
      </p>
    </div>
  </div>
{/if}

<Page
  classContainer="container mx-auto max-w-screen-xl p-4 "
  classContentSlot="mt-2 px-4 relative text-gray-900 flex flex-col md:mb-8 overflow-y-hidden"
>
  <svelte:fragment slot="pageHeader">
    <h2 class=" mt-[1em] text-2xl md:text-3xl text-gray-900 font-bold">
      Nuestras sucursales
    </h2>
  </svelte:fragment>

  <section
    class="mt-4 grid grid-rows-3 md:grid-rows-1 md:grid-cols-3 gap-4 md:gap-0 lg:gap-4 flex-1 overflow-y-hidden"
  >
    <div
      class="col-span-1 row-span-2 md:row-span-1 md:col-span-2 relative flex flex-col"
    >
      <Map bind:mapController {initialCenter} {marks} />
    </div>

    <div class="flex-1 flex flex-col overflow-y-hidden scrollbar">
      <ul
        class="flex md:grid gap-4 mb-auto overflow-y-auto scrollbar py-4 md:py-0 px-4"
      >
        {#each data.subsidiaries as subsidiary}
          <li class=" min-w-max h-max">
            <SubsidiaryCardPreview {subsidiary} on:relocate={relocate} />
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
