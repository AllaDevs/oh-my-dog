<script lang="ts">
  import { page } from '$app/stores';
  import Header from '$cmp/layout/Header.svelte';
  import Layout from '$cmp/layout/Layout.svelte';

  const BASEPATH = '/';

  const navLinks = [
    { href: '/', text: 'Inicio' },
    { href: '/me/appointment', text: 'Turnos', requiresLogin: true },
    { href: '/me', text: 'Mi cuenta', requiresLogin: true },
    { href: '/adoption', text: 'Adopcion' },
    { href: '/donation', text: 'Donacion' },
    { href: '/provider', text: 'Paseadores y cuidadores' },
  ];
</script>

<Layout>
  <svelte:fragment slot="header">
    <Header homePath={BASEPATH} {navLinks}>
      <svelte:fragment slot="right">
        {#if $page.data.user}
          <div class="header-item md:hidden">
            <a
              href="/me"
              class=" p-2 font-bold underline-offset-2 hover:underline"
            >
              Mi cuenta
            </a>
          </div>
          <form method="POST" action="/logout" class="header-item w-max">
            <button
              type="submit"
              class=" p-2 font-bold underline-offset-2 hover:underline"
            >
              Cerrar Sesión
            </button>
          </form>
        {:else if $page.url.pathname !== '/login'}
          <div class="header-item w-max">
            <a
              href="/login"
              class=" p-2 font-bold underline-offset-2 hover:underline"
            >
              Iniciar Sesión
            </a>
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
