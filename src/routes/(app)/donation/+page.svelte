<script lang="ts">
  import CampaignCard from '$cmp/donation/CampaignCard.svelte';
  import GeneralDonationForm from '$cmp/donation/GeneralDonationForm.svelte';
  import A from '$cmp/element/A.svelte';
  import Page from '$cmp/layout/Page.svelte';
  import { onMount } from 'svelte';
  import { superForm } from 'sveltekit-superforms/client';
  import { notifyDonationStatus } from './donationShared.js';

  export let data;

  const generalSForm = superForm(data.generalForm, {
    taintedMessage: false,
  });

  onMount(() => {
    notifyDonationStatus(data.donationStatus);
    // history.replaceState({}, '', new URL($page.url.origin + $page.url.pathname));
  });
</script>

<svelte:head>
  <title>Donacion</title>
</svelte:head>

<Page
  classContainer="container mx-auto px-6 py-4 scrollbar"
  classHeaderSlot="flex justify-between items-end"
  classContentSlot="flex flex-col gap-6 px-4 justify-around"
>
  <svelte:fragment slot="pageHeader">
    <h2 class=" mt-4 text-2xl">Donaciones</h2>
  </svelte:fragment>

  <section class="mt-4 lg:max-w-md">
    <GeneralDonationForm
      action="?/generalDonation"
      sForm={generalSForm}
      title="Donar a la veterinaria"
    />
  </section>

  <section>
    <h3 class=" mt-4 text-xl font-medium">Listado de campañas</h3>
    <ul
      class="grid gap-8 grid-cols my-4 lg:grid-cols-2 lg:gap-16 lg:mt-8 lg:mb-16"
    >
      {#each data.campaigns as campaign (campaign.id)}
        <li class="max-w-[28rem] mx-auto lg:max-w-[52rem] w-full">
          <CampaignCard {campaign}>
            <svelte:fragment slot="actions">
              <A href="/donation/campaign/{campaign.id}" color="primary" button>
                Ver campaña
              </A>
            </svelte:fragment>
          </CampaignCard>
        </li>
      {:else}
        <li>
          <p class=" text-gray-700">No hay campañas de donacion registradas</p>
        </li>
      {/each}
    </ul>
  </section>
</Page>
