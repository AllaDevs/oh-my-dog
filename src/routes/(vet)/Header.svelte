<script lang="ts">
  import { page } from '$app/stores';

  type T = $$Generic<Record<string, unknown>>;

  export let user: T;

  const navLinks = [
    { href: '/vet/client', text: 'Clientes' },
    { href: '/vet/appointment', text: 'Turnos' },
    { href: '/vet/donation', text: 'Donaciones' },
    { href: '/vet/publicity', text: 'Paseadores y Cuidadores' },
    { href: '/vet/subsidiary', text: 'Sucursales' },
    { href: '/vet/me', text: 'Cuenta' },
  ];

  $: onVetHome = $page.url.pathname === '/vet';
</script>

<header class=" sticky top-0 flex z-10 w-full justify-between bg-teal-100 p-2">
  <div class=" flex items-center p-1 sm:p-2 md:p-4">
    <button class="btn btn-sm mr-4 lg:hidden">
      <span>
        <svg viewBox="0 0 100 80" class="fill-token h-4 w-4">
          <rect width="100" height="20" />
          <rect y="30" width="100" height="20" />
          <rect y="60" width="100" height="20" />
        </svg>
      </span>
    </button>
    <a
      href={onVetHome ? '#main' : '/vet'}
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
    <ul class=" flex" class:hidden={onVetHome}>
      {#each navLinks as { href, text }}
        {@const current = $page.url.pathname === href}
        <li class=" p-1 sm:p-2 md:p-4">
          <a
            aria-current={current ? 'page' : false}
            href={current ? '#main' : href}
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
      <form method="POST" action="/vet/logout" class="inline p-1 sm:p-2 md:p-4">
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
