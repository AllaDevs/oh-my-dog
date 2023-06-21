<script>
  import A from '$cmp/element/A.svelte';
  import ProviderPreviewCard from '$lib/components/service/ProviderPreviewCard.svelte';
  import { TabItem, Tabs } from 'flowbite-svelte';

  export let data;
</script>

<svelte:head>
  <title>Servicios de Terceros</title>
</svelte:head>

<main class=" container flex flex-col gap-4 p-4 lg:max-w-screen-lg mx-auto">
  <div
    class="flex flex-row space-between mt-10 mb-10 ml-12 mr-12 justify-between"
  >
    <p class="text-3xl font-semibold text-gray-900">Servicios de terceros</p>
    <A href="/vet/provider/new" color="primary" button={true}>Nuevo Proveedor</A
    >
  </div>
  <Tabs
    style="full"
    defaultClass="flex rounded-lg divide-x divide-gray-200 shadow"
    activeClass="flex rounded-lg divide-x divide-gray-200 shadow bg-teal-500"
  >
    <TabItem open title="Paseadores" class="w-full">
      <div class=" grid mt-2 gap-2 grid-cols-1 md:grid-cols-1 md:gap-x-8 w-fit">
        {#each data.walkers as walker}
          <ProviderPreviewCard
            id={walker.id}
            username={walker.username}
            lastname={walker.lastname}
            areas={walker.areas}
          />
        {/each}
      </div>
    </TabItem>
    <TabItem title="Cuidadores" class="w-full">
      <div class=" grid mt-2 gap-2 grid-cols-1 md:grid-cols-1 md:gap-x-8">
        {#each data.sitters as sitter}
          <ProviderPreviewCard
            id={sitter.id}
            username={sitter.username}
            lastname={sitter.lastname}
            areas={sitter.areas}
          />
        {/each}
      </div>
    </TabItem>
  </Tabs>
</main>
