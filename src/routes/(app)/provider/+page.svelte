<script>
  import Page from '$cmp/layout/Page.svelte';
  import ProviderCard from '$lib/components/service/ProviderCard.svelte';
  import { TabItem, Tabs } from 'flowbite-svelte';

  export let data;
</script>

<svelte:head>
  <title>Servicios de Terceros</title>
</svelte:head>

<Page
  classContentSlot=" container flex flex-col gap-4 p-4 lg:max-w-screen-lg mx-auto"
>
  <div
    class="flex flex-row space-between mt-10 mb-10 ml-12 mr-12 justify-between"
  >
    <p class="text-3xl font-semibold text-gray-900">Servicios de terceros</p>
  </div>
  <Tabs
    style="full"
    defaultClass="flex rounded-lg divide-x divide-gray-200 shadow"
    activeClass="flex rounded-lg divide-x divide-gray-200 shadow bg-teal-500"
  >
    <TabItem open title="Paseadores" class="w-full">
      {#each data.walkers as walker}
        <ProviderCard
          id={walker.id}
          username={walker.username}
          lastname={walker.lastname}
          email={walker.email}
          areas={walker.areas}
          workingHours={walker.workingHour}
        />
      {/each}
    </TabItem>
    <TabItem title="Cuidadores" class="w-full">
      {#each data.sitters as sitter}
        <ProviderCard
          id={sitter.id}
          username={sitter.username}
          lastname={sitter.lastname}
          email={sitter.email}
          areas={sitter.areas}
          workingHours={sitter.workingHour}
        />
      {/each}
    </TabItem>
  </Tabs>
</Page>
