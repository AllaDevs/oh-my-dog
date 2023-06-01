<script>
  import ProviderCard from '$lib/components/service/ProviderCard.svelte';
  import { TabItem, Tabs } from 'flowbite-svelte';

  export let data;
</script>

<svelte:head>
  <title>Servicios de Terceros</title>
</svelte:head>
<div
  class="flex flex-row space-between mt-10 mb-10 ml-12 mr-12 justify-between"
>
  <p class="text-3xl font-semibold text-gray-900">Servicios de terceros</p>
  <a href="/vet/provider/new" class="btn variant-filled btn-sm"
    >Nuevo Proveedor</a
  >
</div>
<Tabs style="underline">
  <TabItem open title="Paseadores">
    {#each data.walkers as walker}
      <ProviderCard
        id={walker.id}
        username={walker.username}
        lastname={walker.lastname}
        areas={walker.areas}
      />
    {/each}
  </TabItem>
  <TabItem title="Cuidadores">
    {#each data.sitters as sitter}
      <ProviderCard
        id={sitter.id}
        username={sitter.username}
        lastname={sitter.lastname}
        areas={sitter.areas}
      />
    {/each}
  </TabItem>
</Tabs>
