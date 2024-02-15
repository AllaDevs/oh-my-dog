<script lang="ts">
  import type { DonationCampaign } from "@prisma/client";

  export let campaign: DonationCampaign;
</script>

<div
  class="max-w-lg rounded shadow-lg bg-teal-100/50 border border-teal-500/50 hover:shadow-2xl"
>
  <img
    class="w-full h-60 object-cover rounded-t border-b border-teal-500/50"
    src={campaign.banner?.url}
    alt="banner de la campaña de donacion {campaign.name}"
  />

  <div class="px-6 py-4">
    <h3 class="font-semibold text-lg mb-2">
      {campaign.name}
    </h3>
    <p class="text-gray-700 text-base break-all line-clamp-3">
      {campaign.description}
    </p>
  </div>

  {#if $$slots.actions}
    <div class="px-6 py-4 mb-2">
      <slot name="actions">/</slot>
    </div>
  {/if}
</div>
