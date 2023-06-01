<script>
  import ProviderCard from '$lib/components/service/ProviderCard.svelte';
  import { TabItem, Tabs } from 'flowbite-svelte';

  export let data;
</script>

<svelte:head>
  <title>Servicios de Terceros</title>
</svelte:head>

<Tabs style="underline">
  <TabItem open title="Paseadores">
    {#each data.walkers as walker}
      <ProviderCard
        id="{walker.id};"
        username="{walker.username};"
        lastname="{walker.lastname};"
        areas="{walker.areas};"
      />
    {/each}
  </TabItem>
  <TabItem title="Cuidadores">
    {#each data.sitters as sitter}
      <ProviderCard
        id="{sitter.id};"
        username="{sitter.username};"
        lastname="{sitter.lastname};"
        areas="{sitter.areas};"
      />
    {/each}
  </TabItem>
</Tabs>
