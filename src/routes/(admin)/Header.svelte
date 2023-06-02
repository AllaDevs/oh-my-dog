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

  $: onDevHome = $page.url.pathname === BASEPATH;
</script>

<header class=" sticky top-0 flex z-10 w-full justify-between bg-teal-100 p-2">
  <div class=" flex items-center p-1 sm:p-2 md:p-4">
    <a
      href={onDevHome ? '#main' : '/dev'}
      aria-current={onDevHome ? 'page' : false}
      class=" px-4 flex justify-center items-center py-1 underline-offset-2 rounded-md hover:underline"
    >
      <img src="/bone.png" alt="¡Oh my dog! logo" class="h-10 w-10" />
      <strong class="text-xl mx-1">¡Oh my dog!</strong>
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
