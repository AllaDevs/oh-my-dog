<script>
  import A from '$cmp/element/A.svelte';
  import Page from '$cmp/layout/Page.svelte';
  import ProviderPreviewCard from '$lib/components/service/ProviderPreviewCard.svelte';
  import { TabItem, Tabs } from 'flowbite-svelte';

  export let data;
</script>

<svelte:head>
  <title>Servicios de Terceros</title>
</svelte:head>

<Page
  classContainer="container mx-auto px-6 py-4 text-gray-700"
  classContentSlot="py-2"
>
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
      <div class=" grid mt-2 gap-2 grid-cols-1 md:grid-cols-2 md:gap-x-5">
        {#each data.walkers as walker}
          <ProviderPreviewCard
            id={walker.id}
            firstname={walker.firstname}
            lastname={walker.lastname}
            email={walker.email}
          />
        {/each}
      </div>
    </TabItem>
    <TabItem title="Cuidadores" class="w-full">
      <div class=" grid mt-2 gap-2 grid-cols-1 md:grid-cols-2 md:gap-x-5">
        {#each data.sitters as sitter}
          <ProviderPreviewCard
            id={sitter.id}
            firstname={sitter.firstname}
            lastname={sitter.lastname}
            email={sitter.email}
          />
        {/each}
      </div>
    </TabItem>
  </Tabs>
</Page>
