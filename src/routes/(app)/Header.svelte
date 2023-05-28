<script lang="ts">
  import { page } from '$app/stores';

  export let user: Record<string, unknown> | null;

  const navLinks = [
    { href: '/', text: 'Inicio' },
    { href: '/me/appointment', text: 'Turnos', requiresLogin: true },
    { href: '/me', text: 'Mi cuenta', requiresLogin: true },
  ];

  $: onHome = $page.url.pathname === '/';
</script>

<header class=" sticky top-0 flex w-full justify-between bg-teal-100/75 p-2">
  <div class=" flex items-center p-1 sm:p-2 md:p-4">
    <button class=" btn btn-sm mr-4 lg:hidden">
      <span>
        <svg viewBox="0 0 100 80" class="fill-token h-4 w-4">
          <rect width="100" height="20" />
          <rect y="30" width="100" height="20" />
          <rect y="60" width="100" height="20" />
        </svg>
      </span>
    </button>
    <a
      href={onHome ? '#main' : '/'}
      aria-current={onHome ? 'page' : false}
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
      {#each navLinks as { href, text, requiresLogin }}
        {@const current = $page.url.pathname === href}
        {#if !requiresLogin || user}
          <li class=" p-1 sm:p-2 md:p-4">
            <a
              aria-current={current ? 'page' : false}
              href={current ? '#main' : href}
              class=" rounded p-2 underline-offset-2 hover:bg-teal-200 hover:underline"
            >
              {text}
            </a>
          </li>
        {/if}
      {/each}
    </ul>
  </nav>

  <div class=" flex items-center">
    {#if user}
      <form method="POST" action="/logout" class=" inline p-1 sm:p-2 md:p-4">
        <button
          type="submit"
          class=" rounded p-2 font-bold underline-offset-2 hover:bg-teal-200 hover:underline"
        >
          Cerrar Sesión
        </button>
      </form>
    {:else if $page.url.pathname !== '/login'}
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
