<script lang="ts">
  import { page } from '$app/stores';
  import Header from '$cmp/layout/Header.svelte';
  import Layout from '$cmp/layout/Layout.svelte';
</script>

<Layout class="[&_*]:scrollbar">
  <svelte:fragment slot="header">
    <Header homePath="/">
      <svelte:fragment slot="right">
        {#if $page.data.user}
          <form method="POST" action="/logout" class="header-item">
            <button type="submit" class="nav-button"> Cerrar Sesión </button>
          </form>
        {:else}
          {@const onLogin = $page.url.pathname === '/login'}
          <div class="header-item">
            <a href={onLogin ? '/' : '/login'} class="nav-button">
              {onLogin ? 'Inicio' : 'Iniciar Sesión'}
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

<style lang="postcss">
  .nav-button {
    @apply p-2 font-semibold text-gray-900 hover:text-black underline-offset-2 hover:underline whitespace-nowrap;
  }
</style>
