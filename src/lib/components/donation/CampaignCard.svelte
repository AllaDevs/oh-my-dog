<script lang="ts">
  import type { DonationCampaign } from '@prisma/client';
  import A from '../element/A.svelte';

  export let campaign: DonationCampaign;
</script>

<div
  class=" flex justify-around min-h-full transition-transform hover:scale-105 border border-teal-500/50 bg-teal-100/25 p-4 hover:border-teal-500 hover:bg-teal-100/50 flex-grow bg-teal-100 rounded-lg w-96"
>
  <img
    class="rounded-full w-24 h-24"
    src={campaign.banner?.url ?? '/dog_silhouette.png'}
    alt="dog"
  />
  <div class=" flex flex-col justify-around">
    <h1 class="font-bold">
      {campaign.name}
    </h1>
    <A
      href="/vet/donation/campaign/{campaign.id}"
      color="teal"
      intensity={600}
      opacity={80}
    >
      Ver perfil
    </A>
  </div>
</div>
