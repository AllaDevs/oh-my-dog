<script lang="ts">
  import { page } from '$app/stores';

  export let user: Record<string, unknown>;

  const BASEPATH = '/dev';

  const navLinks = [
    { href: `${BASEPATH}/breed`, text: 'Breeds' },
    { href: `${BASEPATH}/vet`, text: 'Vets' },
    // { href: `${BASEPATH}/client`, text: 'Clients' },
    // { href: `${BASEPATH}/dog`, text: 'Dogs' },
    // { href: `${BASEPATH}/services`, text: 'Services' },
  ];

  $: onVetHome = $page.url.pathname === BASEPATH;
</script>

<header class=" sticky top-0 flex z-10 w-full justify-between bg-teal-100 p-2">
  <div class=" flex items-center p-1 sm:p-2 md:p-4">
    <a
      href={onVetHome ? '#main' : BASEPATH}
      aria-current={onVetHome ? 'page' : false}
      class="  rounded px-2 py-1 underline-offset-2 hover:bg-teal-200 hover:underline"
    >
      <strong class="text-xl">¡Oh my dog!</strong>
    </a>
  </div>

  <nav
    aria-label="Main navigation"
    class=" mx-auto hidden max-w-7xl items-center justify-between md:flex lg:px-8"
  >
    <ul class=" flex">
      {#each navLinks as { href, text }}
        {@const current = $page.url.pathname === href}
        <li class=" p-1 sm:p-2 md:p-4">
          <a
            href={current ? '#main' : href}
            aria-current={current ? 'page' : false}
            class=" rounded p-2 underline-offset-2 hover:bg-teal-200 hover:underline"
          >
            {text}
          </a>
        </li>
      {/each}
    </ul>
  </nav>

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
    {/if}
  </div>
</header>
