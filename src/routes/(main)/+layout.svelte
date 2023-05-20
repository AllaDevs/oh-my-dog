<script lang="ts">
  import { page } from '$app/stores';
  import NavItem from '$lib/components/navbar/NavItem.svelte';
  import NavLink from '$lib/components/navbar/NavLink.svelte';

  export let data;

  const navLinks: { href: string; text: string }[] = [
    {
      href: '/',
      text: 'Inicio',
    },
    {
      href: '/me',
      text: 'Yo',
    },
    {
      href: '/me/appointments',
      text: 'Turnos',
    },
  ];
</script>

<header class=" bg-teal-50">
  <nav
    aria-label="Main navigation"
    class=" mx-auto flex max-w-7xl items-center justify-between p-1 sm:p-2 lg:px-8"
  >
    <NavLink
      href={$page.url.pathname === '/' ? '#main' : '/'}
      current={$page.url.pathname === '/'}
      noVisualEffects={true}
    >
      <span class=" sr-only">¡Oh my dog!</span>
      <img
        src="ohmydog_transparent.png"
        alt="Oh my dog logo"
        class=" h-8 w-auto scale-[1.5]"
      />
    </NavLink>
    <ul class=" flex">
      {#each navLinks as { href, text }}
        {@const current = $page.url.pathname === href}
        <NavItem>
          <NavLink {current} href={current ? '#main' : href}>{text}</NavLink>
        </NavItem>
      {/each}
      {#if data.user}
        <NavItem>
          <form method="POST" action="logout" class=" inline">
            <button
              class=" p-2 hover:bg-teal-200 hover:underline underline-offset-2 rounded"
              type="submit"
            >
              Cerrar Sesión
            </button>
          </form>
        </NavItem>
      {:else if $page.route.id !== '/(main)/login' && !$page.route.id?.startsWith('/(main)/password_reset')}
        <NavItem>
          <NavLink href="/login">Iniciar Sesión</NavLink>
        </NavItem>
      {/if}
    </ul>
  </nav>
</header>

<main id="main">
  <slot />
</main>
