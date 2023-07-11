<script lang="ts">
  import Header from '$cmp/layout/Header.svelte';
  import Layout from '$cmp/layout/Layout.svelte';

  const BASEPATH = '/dev';

  const navLinks = [
    { href: `/`, text: 'Site home' },
    { href: `/dev`, text: 'Admin home' },
    { href: `/dev/vet`, text: 'Vets' },
    { href: `/dev/client`, text: 'Clients' },
    { href: `/dev/breed`, text: 'Breeds' },
    { href: `/dev/app_services`, text: 'Services' },
  ];

  export let data;
</script>

<Layout>
  <svelte:fragment slot="header">
    <Header homePath={BASEPATH} {navLinks}>
      <svelte:fragment slot="right">
        {#if data.user}
          <form method="POST" action="/logout" class="header-item">
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
