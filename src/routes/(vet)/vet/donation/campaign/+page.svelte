<script lang="ts">
  import Page from '$cmp/layout/Page.svelte';
  import CampaignCard from '$lib/components/donation/CampaignCard.svelte';
  import A from '$lib/components/element/A.svelte';

  export let data;
</script>

<svelte:head>
  <title>Campañas de donacion</title>
</svelte:head>

<Page
  classContainer="container mx-auto px-6 py-4 scrollbar"
  classHeaderSlot="flex justify-between items-end"
  classContentSlot="flex flex-col gap-8 px-4 justify-around lg:flex-row"
>
  <svelte:fragment slot="pageHeader">
    <h2 class=" mt-4 text-2xl">Campañas de donacion</h2>
    <A href="/vet/donation/campaign/new" color="teal" intensity={600}>
      Nueva campaña
    </A>
  </svelte:fragment>

  <section class="">
    <h3 class="mt-4 text-xl font-bold">Listado de campañas</h3>
    <ul class="grid gap-4 grid-cols lg:grid-cols-2">
      {#each data.campaigns as campaign (campaign.id)}
        <li>
          <CampaignCard {campaign} />
        </li>
      {:else}
        <li>
          <p class=" text-gray-700">No hay camapañas de donacion registradas</p>
        </li>
      {/each}
    </ul>
  </section>
</Page>
