<script>
  import { Tabs, TabItem } from 'flowbite-svelte';
  export let data;
  
</script>

<svelte:head>
  <title>Servicios de Terceros</title>
</svelte:head>

<Tabs style="underline">
  <TabItem open title="Paseadores">
    {#each data.walkers as walker}
      <ProviderCard>
        id={walker.id};
        username={walker.username};
        lastname={walker.lastname};
        workingHour={walker.workingHour};
      </ProviderCard>
    {/each}
  </TabItem>
  <TabItem title="Cuidadores">
    {#each data.sitters as sitter}
      <ProviderCard>
        id={walker.id};
        username={walker.username};
        lastname={walker.lastname};
        workingHour={walker.workingHour};
      </ProviderCard>
    {/each}
  </TabItem>
</Tabs>

