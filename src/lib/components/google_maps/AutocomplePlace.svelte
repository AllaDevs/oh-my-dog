<script lang="ts">
  import { PUBLIC_GOOGLE_MAPS_API_KEY } from '$env/static/public';
  import { Loader } from '@googlemaps/js-api-loader';
  import { createEventDispatcher } from 'svelte';

  interface $$Slots {
    belowInput: {};
    oppositeToLabel: {};
  }

  export let field: string;
  export let value: string;

  export let label: string;
  export let hint: string | undefined = undefined;
  export let readonly = false;
  export let required = false;
  export let placeholder: string | undefined = undefined;

  type T = $$Generic<boolean>;

  export let initialLatLng: google.maps.LatLngLiteral | undefined = undefined;
  export let enableMarker: T = false as T;
  export let centerOnInput = false;

  let googleLibs: typeof enableMarker extends true
    ? {
        places: google.maps.PlacesLibrary;
        marker: google.maps.MarkerLibrary;
      }
    : {
        places: google.maps.PlacesLibrary;
      };

  let error: string | undefined = undefined;
  let valid = false;
  let input: HTMLInputElement;
  let mapController: google.maps.Map;
  let inputMarker: google.maps.Marker;

  const loader = new Loader({
    apiKey: PUBLIC_GOOGLE_MAPS_API_KEY,
    version: 'weekly',
    authReferrerPolicy: 'origin',
  });

  async function importGoogleMapsLibraries() {
    if (enableMarker) {
      const [places, marker] = await Promise.all([
        loader.importLibrary('places'),
        loader.importLibrary('marker'),
      ]);

      googleLibs = { places, marker } as typeof googleLibs;
      return;
    }

    googleLibs = {
      places: await loader.importLibrary('places'),
    } as typeof googleLibs;
  }

  const dispatch = createEventDispatcher<{
    location_change: { location: google.maps.LatLng };
    place_change: { place: google.maps.places.PlaceResult };
  }>();

  export async function initAutocomple(map?: google.maps.Map) {
    await importGoogleMapsLibraries();
    // Make the search bar into a Places Autocomplete search bar and select
    // which detail fields should be returned about the place that
    // the user selects from the suggestions.
    const autocomplete = new googleLibs.places.Autocomplete(input, {
      types: ['address'],
      componentRestrictions: { country: 'ar' },
    });

    autocomplete.setFields(['address_components', 'geometry', 'name']);

    autocomplete.addListener('place_changed', async () => {
      const place = autocomplete.getPlace();
      value = input.value;

      dispatch('place_change', { place });

      // If place doesn't have geometry means it's not a valid place
      // User entered the name of a Place that was not suggested and
      // pressed the Enter key, or the Place Details request failed.

      if (!place.geometry) {
        if (inputMarker) {
          inputMarker.setVisible(false);
        }
        error = `No existe la ubicación '${place.name}'`;
        valid = false;
        return;
      }
      error = undefined;
      valid = true;

      let inputLocation = place.geometry.location!;

      if (inputMarker) {
        inputMarker.setPosition(inputLocation);
        inputMarker.setVisible(true);
      }
      if (centerOnInput) {
        mapController.setCenter(inputLocation);
        mapController.setZoom(15);
      }

      dispatch('location_change', { location: inputLocation });
    });

    if (map) {
      mapController = map;
    }

    if (enableMarker) {
      if (!map) {
        throw new Error('Map is required when enableMarker is true');
      }
      if (!('marker' in googleLibs)) {
        throw new Error('Marker library is required when enableMarker is true');
      }

      inputMarker = new googleLibs.marker.Marker({
        map: map,
        position: initialLatLng,
      });

      if (initialLatLng) {
        inputMarker.setVisible(true);
        autocomplete.set('place', {
          geometry: {
            location: initialLatLng,
          },
        });
      } else {
        inputMarker.setVisible(false);
      }
    }
  }
</script>

<div class=" mt-2">
  <div class=" flex justify-between text-sm font-medium">
    <label for={field} class=" max-w-fit text-gray-900">
      {label}
    </label>
    {#if $$slots.oppositeToLabel}
      <slot name="oppositeToLabel" />
    {:else if hint}
      <span class=" text-gray-500">{hint}</span>
    {/if}
  </div>
  <div class=" flex flex-col gap-2">
    <input
      bind:this={input}
      type="text"
      id={field}
      name={field}
      {required}
      {readonly}
      bind:value
      {placeholder}
      aria-invalid={!!error || !valid || undefined}
      class=" mt-2 block w-full rounded-md border-none py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6"
    />
    {#if error}
      <p class=" text-sm text-red-500">
        {error}
      </p>
    {/if}
    {#if $$slots.belowInput}
      <slot name="belowInput" />
    {/if}
  </div>
</div>

<!-- <input
bind:this={input}
type="text"
id="pac-input"
name="pac-input"
placeholder="Dirección en el mapa"
required
class=" mt-2 block w-full rounded-md border-none py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6"
/> -->

<style lang="postcss">
  div:has(div input[required]:not(:read-only)) label::after {
    content: ' *';
    color: red;
  }

  input:focus {
    @apply ring-2 ring-teal-600;
  }
  input:read-only {
    @apply cursor-not-allowed bg-gray-100 ring-gray-200;
  }
</style>
