<script lang="ts">
  import { page } from '$app/stores';
  import '../app.css';
  import type { PageData } from './$types';

  export let data: PageData;
</script>

<div class=" flex justify-end">
  {#if data.user}
    <div class=" flex justify-end p-4">
      <form method="POST">
        <button
          class="bg-teal-500 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded"
          formaction="/logout"
          type="submit">Cerrar Sesión</button
        >
      </form>
    </div>
  {:else if $page.route.id !== '/login' && !$page.route.id?.startsWith('/password_reset')}
    <div class=" flex justify-end p-4">
      <a
        href="/login"
        class="bg-teal-500 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded"
        >Iniciar Sesión</a
      >
    </div>
  {/if}
</div>

<div class="grid place-items-center p-16">
  <slot />
</div>
