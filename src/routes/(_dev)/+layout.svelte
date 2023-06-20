<script lang="ts">
  import Header from '$cmp/layout/Header.svelte';
  import Layout from '$cmp/layout/Layout.svelte';
  import Page from '$cmp/layout/Page.svelte';

  const BASEPATH = '/dev';

  const navLinks = [
    { href: `/`, text: 'Site home' },
    { href: `/dev`, text: 'Home' },
    { href: `/dev/vet`, text: 'Vets' },
    { href: `/dev/breed`, text: 'Breeds' },
    // { href: `/dev/client`, text: 'Clients' },
    // { href: `/dev/dog`, text: 'Dogs' },
    // { href: `/dev/services`, text: 'Services' },
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

  <Page classContainer="overflow-y-auto scrollbar">
    <slot />
  </Page>

  <svelte:fragment slot="main">
    <Page classContainer="overflow-y-auto scrollbar">
      <slot />
    </Page>
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
