<script lang="ts">
  import Header from '$cmp/layout/Header.svelte';
  import Layout from '$cmp/layout/Layout.svelte';
  import Page from '$cmp/layout/Page.svelte';

  const BASEPATH = '/dev';

  const navLinks = [
    { href: `/`, text: 'Site home' },
    { href: `${BASEPATH}/breed`, text: 'Breeds' },
    { href: `${BASEPATH}/vet`, text: 'Vets' },
    // { href: `${BASEPATH}/client`, text: 'Clients' },
    // { href: `${BASEPATH}/dog`, text: 'Dogs' },
    // { href: `${BASEPATH}/services`, text: 'Services' },
  ];

  export let data;
</script>

<Layout>
  <svelte:fragment slot="header">
    <Header homePath={BASEPATH} {navLinks}>
      <svelte:fragment slot="right">
        {#if data.user}
          <form method="POST" action="/logout" class="header-item">
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
