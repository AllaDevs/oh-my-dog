<script lang="ts">
  import Carousel from '$cmp/carousel/Carousel.svelte';
  import type { DonationCampaign } from '@prisma/client';
  import type { ComponentProps } from 'svelte';
  import CampaignCarouselCard from './CampaignCarouselCard.svelte';

  export let campaigns: DonationCampaign[];

  let props: ComponentProps<CampaignCarouselCard>[];

  $: {
    props = [];
    for (const campaign of campaigns) {
      props.push({ campaign });
    }
  }
</script>

<Carousel component={CampaignCarouselCard} {props} />
