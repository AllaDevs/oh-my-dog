<script lang="ts">
  import { page } from '$app/stores';
  import Header from '$cmp/layout/Header.svelte';
  import Layout from '$cmp/layout/Layout.svelte';

  const BASEPATH = '/';

  const navLinks = [
    { href: '/', text: 'Inicio' },
    { href: '/me', text: 'Mi cuenta', requiresLogin: true },
    { href: '/me/appointment', text: 'Mis turnos', requiresLogin: true },
    { href: '/adoption', text: 'Adopcion' },
    { href: '/donation', text: 'Donacion' },
    { href: '/provider', text: 'Paseadores y cuidadores' },
    { href: '/subsidiary', text: 'Sucursales' },
    {
      href: '/subsidiary/urgency',
      text: 'URGENCIAS',
      className:
        'rounded-lg font-semibold !text-gray-100 hover:!text-white bg-red-600/75 hover:bg-red-500 outline-black',
    },
  ];
</script>

<Layout>
  <svelte:fragment slot="header">
    <Header homePath={BASEPATH} {navLinks}>
      <svelte:fragment slot="right">
        {#if $page.data.user}
          <form method="POST" action="/logout" class="header-item w-max">
            <button type="submit" class="nav-button"> Cerrar Sesión </button>
          </form>
        {:else if $page.url.pathname !== '/login'}
          <div class="header-item w-max">
            <a href="/login" class="nav-button"> Iniciar Sesión </a>
          </div>
        {/if}
      </svelte:fragment>
    </Header>
  </svelte:fragment>

  <svelte:fragment slot="main">
    <slot />
  </svelte:fragment>

  <!-- <svelte:fragment slot="footer">
    <div>
      footer placeholder
    </div>
  </svelte:fragment> -->
</Layout>

<style lang="postcss">
  .nav-button {
    @apply p-2 font-semibold text-gray-900 hover:text-black underline-offset-2 hover:underline whitespace-nowrap;
  }
</style>
