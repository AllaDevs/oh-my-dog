<script lang="ts">
  import { page } from '$app/stores';
  import Link from './NavLink.svelte';
  import NavItem from './NavItem.svelte';

  export let links: NavLink[] = [];
  export let ariaLabel: string;
  export let user: any;
  type NavLink = {
    href: string;
    text: string;
    links?: NavLink[];
  };

  const navLinks: NavLink[] = [
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

<nav
  aria-label={ariaLabel}
  class=" mx-auto flex max-w-7xl items-center justify-between p-2 lg:px-8"
>
  <Link
    href={$page.url.pathname === '/' ? '#main' : '/'}
    current={$page.url.pathname === '/'}
  >
    <span class=" sr-only">¡Oh my dog!</span>
    <img
      src="ohmydog_transparent.png"
      alt="Oh my dog logo"
      class=" h-8 w-auto scale-[1.5]"
    />
  </Link>
  <ul class=" flex">
    {#each navLinks as { href, text, links }}
      {@const current = $page.url.pathname === href}
      <NavItem>
        <Link {current} href={current ? '#main' : href}>{text}</Link>
      </NavItem>
    {/each}
    {#if user}
      <NavItem>
        <form method="POST">
          <button
            class=" hover:bg-teal-700 font-bold rounded"
            formaction="/logout"
            type="submit">Cerrar Sesión</button
          >
        </form>
      </NavItem>
    {:else if $page.route.id !== '/(main)/login' && !$page.route.id?.startsWith('/(main)/password_reset')}
      <NavItem>
        <Link href="/login">Iniciar Sesión</Link>
      </NavItem>
    {/if}
  </ul>
</nav>
