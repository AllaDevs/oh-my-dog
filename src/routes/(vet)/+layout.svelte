<script lang="ts">
  import { page } from '$app/stores';
  import { Header } from '$lib/components/layout';

  const BASEPATH = '/vet';

  const navLinks = [
    { href: '/vet/client', text: 'Clientes' },
    { href: '/vet/appointment', text: 'Turnos' },
    { href: '/vet/donation', text: 'Donaciones' },
    { href: '/vet/provider', text: 'Paseadores y Cuidadores' },
    { href: '/vet/subsidiary', text: 'Sucursales' },
    { href: '/vet/me', text: 'Cuenta administrativa' },
  ];
</script>

<Header homePath={BASEPATH} {navLinks}>
  <svelte:fragment slot="right">
    {#if $page.data.user}
      <form method="POST" action="/vet/logout" class="header-item">
        <button
          type="submit"
          class=" rounded p-2 font-bold underline-offset-2 hover:bg-teal-200 hover:underline"
        >
          Cerrar Sesión
        </button>
      </form>
    {/if}
  </svelte:fragment>
</Header>

<div class=" pt-[--header-height]">
  <slot />
</div>

<!-- <footer>
  footer placeholder
</footer> -->
