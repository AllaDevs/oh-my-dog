<script lang="ts">
  import Page from '$cmp/layout/Page.svelte';

  export let data;
</script>

<svelte:head>
  <title>Veterinaria ¡Oh my dog!</title>
</svelte:head>

<Page classContainer=" p-4">
  <svelte:fragment slot="pageHeader">
    <h1 class="mt-4 text-3xl font-bold">
      Bienvenido {data.client?.username ?? ''} a ¡Oh my dog!
    </h1>
  </svelte:fragment>
  <p class="mt-2">Pagina de inicio, se completara con contenido</p>
</Page>
