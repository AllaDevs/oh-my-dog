<script lang="ts">
  export let data;
</script>

<svelte:head>
  <title>Veterinaria ¡Oh my dog!</title>
</svelte:head>

<main id="main" class="mx-auto p-4">
  <h1 class="mt-4 text-3xl font-bold">
    Bienvenido {data.client?.username ?? ''} a ¡Oh my dog!
  </h1>
  <p class="mt-2">Pagina de inicio, se completara con contenido</p>
</main>
