<script lang="ts">
  import { dev } from '$app/environment';
  import '../app.css';

  import { Toaster } from 'svelte-french-toast';
</script>

{#if dev}
  <div class=" fixed bottom-0 right-0 bg-red-500 p-2 text-xs text-white">
    DEV
  </div>
{/if}

<Toaster />

<slot />
