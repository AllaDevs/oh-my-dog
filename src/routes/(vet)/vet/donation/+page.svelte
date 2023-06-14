<script lang="ts">
  import DonationsTable from '$cmp/donation/DonationsTable.svelte';
  import Page from '$cmp/layout/Page.svelte';
  import PageCard from '$cmp/shared/PageCard.svelte';

  export let data;
</script>

<svelte:head>
  <title>Donaciones</title>
</svelte:head>

<Page
  classContainer="container mx-auto px-6 py-4"
  classContentSlot="px-4 py-2 flex flex-col gap-4"
>
  <svelte:fragment slot="pageHeader">
    <h2 class=" mt-4 text-2xl">Donaciones</h2>
  </svelte:fragment>

  <section class="grid gap-4">
    <h3 class=" text-xl mt-4 lg:mt-10">Campañas de donacion</h3>
    <div class=" max-w-xs">
      <PageCard href="/vet/donation/campaign">
        <h3 slot="header" class="h3">Ver listado</h3>
        <p slot="content" />
      </PageCard>
    </div>
  </section>

  <section class="grid gap-4">
    <h3 class=" text-xl mt-4 lg:mt-10">Donaciones generales</h3>
    <DonationsTable donations={data.generalDonations} />
  </section>
</Page>
