<script lang="ts">
  import { page } from '$app/stores';
  import { Header } from '$lib/components/layout';

  const BASEPATH = '/';

  const navLinks = [
    { href: '/', text: 'Inicio' },
    { href: '/me/appointment', text: 'Turnos', requiresLogin: true },
    { href: '/me', text: 'Mi cuenta', requiresLogin: true },
    { href: '/adoption', text: 'Adopcion' },
    { href: '/provider', text: 'Paseadores y cuidadores' },
  ];
</script>

<Header homePath={BASEPATH} {navLinks}>
  <svelte:fragment slot="right">
    {#if $page.data.user}
      <div class="header-item md:hidden">
        <a
          href="/me"
          class=" rounded p-2 font-bold underline-offset-2 hover:bg-teal-200 hover:underline"
        >
          Mi cuenta
        </a>
      </div>
      <form method="POST" action="/logout" class="header-item">
        <button
          type="submit"
          class=" rounded p-2 font-bold underline-offset-2 hover:bg-teal-200 hover:underline"
        >
          Cerrar Sesión
        </button>
      </form>
    {:else if $page.url.pathname !== '/login'}
      <div class="header-item">
        <a
          href="/login"
          class=" rounded p-2 font-bold underline-offset-2 hover:bg-teal-200 hover:underline"
        >
          Iniciar Sesión
        </a>
      </div>
    {/if}
  </svelte:fragment>
</Header>

<div class=" pt-[--header-height]">
  <slot />
</div>

<!-- <footer>
  footer placeholder
</footer> -->
