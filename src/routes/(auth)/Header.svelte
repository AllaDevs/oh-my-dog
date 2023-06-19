<script lang="ts">
  import { page } from '$app/stores';

  type T = $$Generic<Record<string, unknown> | null>;

  export let user: T;

  $: onHome = $page.url.pathname === '/';
</script>

<header class=" sticky top-0 flex w-full justify-between bg-teal-100/75 p-2">
  <div class=" flex items-center p-1 sm:p-2 md:p-4">
    <a
      href={onHome ? '#main' : '/'}
      aria-current={onHome ? 'page' : false}
      class=" px-4 flex justify-center items-center py-1 underline-offset-2 rounded-md hover:underline"
    >
      <img src="/bone.png" alt="¡Oh my dog! logo" class="h-10 w-10" />
      <strong class="text-xl mx-1">¡Oh my dog!</strong>
    </a>
  </div>

  <div class=" flex items-center">
    {#if user}
      <form method="POST" action="/logout" class="inline p-1 sm:p-2 md:p-4">
        <button
          type="submit"
          class=" rounded p-2 font-bold underline-offset-2 hover:bg-teal-200 hover:underline"
        >
          Cerrar Sesión
        </button>
      </form>
    {:else if $page.url.pathname === '/login'}
      <div class="p-1 sm:p-2 md:p-4">
        <a
          href="/"
          class=" rounded p-2 font-bold underline-offset-2 hover:bg-teal-200 hover:underline"
        >
          Inicio
        </a>
      </div>
    {:else}
      <div class="p-1 sm:p-2 md:p-4">
        <a
          href="/login"
          class=" rounded p-2 font-bold underline-offset-2 hover:bg-teal-200 hover:underline"
        >
          Iniciar Sesión
        </a>
      </div>
    {/if}
  </div>
</header>
