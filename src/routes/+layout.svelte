<script lang="ts">
  import { dev } from '$app/environment';
  import '../app.css';
</script>

{#if dev}
  <div class=" fixed bottom-0 right-0 p-2 text-xs text-white bg-red-500">
    DEV
  </div>
{/if}

<slot />
