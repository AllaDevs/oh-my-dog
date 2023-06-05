<script lang="ts">
  import { Header, Main } from '$lib/components/layout';

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

<Main centered>
  <slot />
</Main>

<!-- <footer>
  footer placeholder
</footer> -->
