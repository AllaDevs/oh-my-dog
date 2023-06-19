<script lang="ts">
  import A from '$cmp/element/A.svelte';
  import type { DonationCampaign } from '@prisma/client';

  export let campaign: DonationCampaign;
</script>

<div
  class=" flex justify-around min-h-full transition-transform hover:scale-105 border border-teal-500/50 bg-teal-100/25 p-4 hover:border-teal-500 hover:bg-teal-100/50 flex-grow bg-teal-100 rounded-lg w-96"
>
  <img
    class="rounded-full w-24 h-24"
    src={campaign.banner?.url}
    alt="banner de la campaña de donacion {campaign.name}"
  />
  <div class=" flex flex-col justify-around items-center">
    <h1 class="font-bold">
      {campaign.name}
    </h1>
      <A href="/vet/donation/campaign/{campaign.id}" color="primary" button>
        Ver campaña
      </A>
  </div>
</div>
