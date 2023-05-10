<script lang="ts">
  import '../app.css';
  import type { PageData } from './$types';

  export let data: PageData;
</script>

{#if data.user}
  <div class=" flex justify-end p-4">
    <form method="post">
      <button
        class="bg-teal-500 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded"
        formaction="/logout"
        type="submit">Cerrar Sesión</button
      >
    </form>
  </div>
{/if}
<div class="grid place-items-center p-16">
  <slot />
</div>
