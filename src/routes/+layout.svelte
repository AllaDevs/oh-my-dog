<script lang="ts">
  import { dev } from '$app/environment';
  import '../app.css';

  import { Toaster } from 'svelte-french-toast';
</script>

<Toaster />

<slot />

{#if dev}
  <a
    href="/dev"
    class=" fixed bottom-0 z-10 right-0 bg-red-500 p-2 text-xs text-white"
  >
    DEV
  </a>
{/if}
