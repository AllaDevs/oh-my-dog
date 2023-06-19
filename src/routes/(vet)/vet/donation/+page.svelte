<script lang="ts">
  import CampaignCardSimple from '$cmp/donation/CampaignCardSimple.svelte';
  import DonationsTable from '$cmp/donation/DonationsTable.svelte';
  import A from '$cmp/element/A.svelte';
  import Page from '$cmp/layout/Page.svelte';

  export let data;
</script>

<svelte:head>
  <title>Donaciones</title>
</svelte:head>

<Page
  classContainer="container mx-auto px-6 py-4 scrollbar"
  classContentSlot="px-4 py-2 flex flex-col gap-4"
>
  <svelte:fragment slot="pageHeader">
    <h2 class=" mt-4 text-2xl">Donaciones</h2>
  </svelte:fragment>

  <section>
    <div class=" flex justify-between items-end">
      <h3 class=" mt-4 text-xl lg:mt-10">Campañas de donacion</h3>
      <div class="flex gap-4">
        <A href="/vet/donation/campaign/new" color="primary" button>
          Nueva campaña
        </A>
      </div>
    </div>
    <ul
      class="grid gap-8 grid-cols my-4 lg:grid-cols-2 xl:grid-cols-3 lg:gap-16 lg:mt-8 lg:mb-16"
    >
      {#each data.campaigns as campaign (campaign.id)}
        <li class="max-w-[28rem] mx-auto lg:max-w-[52rem]">
          <CampaignCardSimple {campaign}>
            <!-- <svelte:fragment slot="actions">
              <A href="/donation/campaign/{campaign.id}" color="primary" button>
                Ver campaña
              </A>
            </svelte:fragment> -->
          </CampaignCardSimple>
        </li>
      {:else}
        <li>
          <p class=" text-gray-700">No hay campañas de donacion registradas</p>
        </li>
      {/each}
    </ul>
  </section>

  <section class="grid gap-4">
    <h3 class=" text-xl mt-4 lg:mt-10">Donaciones generales</h3>
    <DonationsTable donations={data.generalDonations} />
  </section>
</Page>
