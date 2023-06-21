<script lang="ts">
  import Button from '$cmp/element/Button.svelte';
  import Page from '$cmp/layout/Page.svelte';
  import { te } from '$lib/utils/translateEnums';

  export let data;
</script>

<svelte:head>
  <title>Datos del Proveedor</title>
</svelte:head>

<Page
  classContainer="container mx-auto px-6 py-4 text-gray-700"
  classContentSlot="py-2"
>
  <div class="mt-10 mb-3 ml-12">
    <h3 class="text-3xl font-semibold text-gray-900">Datos del proveedor:</h3>
  </div>

  <div class="mt-6 mb-6 flex flex-col items-center justify-around">
    <h3 class="text-3xl font-semibold p-5 text-gray-900">
      {data.provider.username}
      {data.provider.lastname}
    </h3>
    <p class="p-1"><b>Tipo:</b> {te.DogServiceType(data.provider.type)}</p>
    <p class="p-1"><b>Areas:</b> {data.provider.areas}</p>
    <p class="p-1 mb-5"><b>Descripción:</b> {data.provider.description}</p>
    <Button type="submit" formaction="?/contact" color="primary"
      >Contactar</Button
    >
  </div>
</Page>
