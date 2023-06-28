<script lang="ts">
  import A from '$cmp/element/A.svelte';
  import type { DonationCampaign } from '@prisma/client';

  export let campaign: DonationCampaign;
</script>

<div
  class="flex flex-col h-full rounded shadow-lg bg-teal-100/50 border border-gray-900 hover:scale-105 transition-transform"
>
  <img
    class=" h-[60%] object-cover rounded-t"
    src={campaign.banner?.url}
    alt="banner de la campaña de donacion {campaign.name}"
  />

  <div
    class="flex flex-col justify-between px-6 py-4 border-t border-gray-900 h-full"
  >
    <h3 class="font-semibold text-lg mb-2" style:text-wrap="balance">
      {campaign.name}
    </h3>
    <p class="text-gray-700 text-base break-all line-clamp-3 hidden">
      {campaign.description}
    </p>
    <A href="/donation/campaign/{campaign.id}" color="primary" button>
      Ver campaña de donacion
    </A>
  </div>
</div>
