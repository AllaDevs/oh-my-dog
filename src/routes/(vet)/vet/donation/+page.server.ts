import { DonationReason } from '$lib/enums';
import { prisma } from '$lib/server/prisma';
import type { PageServerLoad } from './$types';


export const load = (async () => {
    const [campaigns, generalDonations] = await Promise.all([
        prisma.donationCampaign.findMany(),
        prisma.donation.findMany({
            where: {
                reason: DonationReason.GENERAL
            },
            include: {
                client: {
                    select: {
                        id: true,
                        username: true,
                        lastname: true
                    }
                }
            }
        })
    ]);

    return {
        campaigns,
        generalDonations
    };
}) satisfies PageServerLoad;
