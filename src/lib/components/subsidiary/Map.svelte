<script lang="ts">
  let container: HTMLDivElement;
  let map: google.maps.Map;
  let zoom = 13;
  let center = { lat: -34.92945, lng: -57.93453 };

  import { onMount } from 'svelte';

  onMount(() => {
    map = new google.maps.Map(container, {
      zoom,
      center,
    });
  });
</script>

<div class="h-[70vh] w-[90vw] mt-7" bind:this={container} />
