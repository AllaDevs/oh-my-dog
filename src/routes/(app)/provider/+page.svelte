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
      <div class=" grid mt-2 gap-2 grid-cols-1 md:gap-x-5">
        {#each data.walkers as walker}
          <ProviderCard
            logged={data.client ? true : false}
            id={walker.id}
            firstname={walker.firstname}
            lastname={walker.lastname}
            workAreas={walker.workAreas}
            workHours={walker.workHours}
            description={walker.description
              ? walker.description
              : 'Sin descripción'}
          />
        {/each}
      </div>
    </TabItem>
    <TabItem title="Cuidadores" class="w-full">
      <div class=" grid mt-2 gap-2 grid-cols-1 md:gap-x-5">
        {#each data.sitters as sitter}
          <ProviderCard
            logged={data.client ? true : false}
            id={sitter.id}
            firstname={sitter.firstname}
            lastname={sitter.lastname}
            workAreas={sitter.workAreas}
            workHours={sitter.workHours}
            description={sitter.description
              ? sitter.description
              : 'Sin descripción'}
          />
        {/each}
      </div>
    </TabItem>
  </Tabs>
</Page>
