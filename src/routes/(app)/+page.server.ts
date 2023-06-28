import { DonationCampaignState } from '$lib/enums';
import { prisma } from '$lib/server/prisma';
import type { PageServerLoad } from './$types';


export const load = (async () => {
    const donationCampaigns = await prisma.donationCampaign.findMany({
        where: {
            state: DonationCampaignState.ACTIVE
        }
    });

    return {
        campaigns: donationCampaigns
    };
}) satisfies PageServerLoad;
