<script lang="ts">
  import { PUBLIC_GOOGLE_MAPS_API_KEY } from '$env/static/public';
  import { Loader } from '@googlemaps/js-api-loader';
  import { createEventDispatcher, onMount } from 'svelte';

  let container: HTMLDivElement;

  let googleLibs: {
    maps: google.maps.MapsLibrary;
  };

  let map: google.maps.Map;
  export { map as mapController };

  export let initialOpts:
    | {
        center?: google.maps.LatLngLiteral;
        zoom?: number;
      }
    | undefined = undefined;

  export let marks: {
    title: string;
    label: string;
    position: google.maps.LatLngLiteral;
  }[] = [];

  let initialLoading = true;

  const mapOptions = {
    center: initialOpts?.center,
    zoom: initialOpts?.zoom ?? 12,
  } satisfies google.maps.MapOptions;

  const loader = new Loader({
    apiKey: PUBLIC_GOOGLE_MAPS_API_KEY,
    version: 'weekly',
    authReferrerPolicy: 'origin',
  });

  async function importGoogleLibs() {
    googleLibs = {
      maps: await loader.importLibrary('maps'),
    };
  }

  const dispatch = createEventDispatcher<{
    initialized: { mapController: google.maps.Map };
  }>();

  async function initializeMap() {
    await importGoogleLibs();

    map = new googleLibs.maps.Map(container, mapOptions);

    for (const mark of marks) {
      const marker = new google.maps.Marker({
        position: mark.position,
        map: map,
        title: mark.title,
        // label: mark.label,
      });
    }

    initialLoading = false;
    dispatch('initialized', { mapController: map });
  }

  onMount(initializeMap);
</script>

{#if initialLoading}
  <div class="grid h-full w-full place-items-center">
    <p class="text-xl font-semibold text-gray-900">Cargando mapa...</p>
  </div>
{/if}

<div class="flex h-full w-full" bind:this={container} />

<!-- 
  some info on library loader
  https://developers.google.com/maps/documentation/javascript/libraries
 -->
