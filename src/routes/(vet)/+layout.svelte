<script lang="ts">
  import { page } from '$app/stores';
  import Header from '$cmp/layout/Header.svelte';
  import Layout from '$cmp/layout/Layout.svelte';

  const BASEPATH = '/vet';

  const navLinks = [
    { href: '/vet/client', text: 'Clientes' },
    { href: '/vet/appointment', text: 'Turnos' },
    { href: '/vet/donation', text: 'Donaciones' },
    { href: '/vet/provider', text: 'Paseadores y cuidadores' },
    { href: '/vet/subsidiary', text: 'Sucursales' },
    { href: '/vet/me', text: 'Cuenta administrativa' },
  ];
</script>

<Layout>
  <svelte:fragment slot="header">
    <Header homePath={BASEPATH} {navLinks}>
      <svelte:fragment slot="right">
        {#if $page.data.user}
          <form method="POST" action="/vet/logout" class="header-item w-max">
            <button type="submit" class="nav-button"> Cerrar Sesión </button>
          </form>
        {/if}
      </svelte:fragment>
    </Header>
  </svelte:fragment>

  <svelte:fragment slot="main">
    <slot />
  </svelte:fragment>

  <!-- <svelte:fragment slot="footer">
    <footer>
      footer placeholder
    </footer>
  </svelte:fragment> -->
</Layout>

<style lang="postcss">
  .nav-button {
    @apply p-2 font-semibold text-gray-900 hover:text-black underline-offset-2 hover:underline whitespace-nowrap;
  }
</style>
