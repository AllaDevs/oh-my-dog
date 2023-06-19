<script lang="ts">
  import Page from '$cmp/layout/Page.svelte';

  export let data;
  data.user;
</script>

<svelte:head>
  <title>Gestion de sucursales</title>
</svelte:head>

<Page
  classContainer="container mx-auto px-6 py-4 text-red-500"
  classContentSlot="py-2"
>
  <svelte:fragment slot="pageHeader">
    <h2 class=" mt-4 text-2xl">Sucursales</h2>
  </svelte:fragment>

  <p>Sin implementar</p>
</Page>
