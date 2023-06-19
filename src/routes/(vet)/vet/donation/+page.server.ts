import { prisma } from '$lib/server/prisma';
import type { PageServerLoad } from './$types';


export const load = (async () => {
    const [campaigns, donors] = await Promise.all([
        prisma.donationCampaign.findMany(),
        prisma.client.findMany({
            where: {
                discountAmount: {
                    gt: 0
                }
            },
            include: {
                _count: {
                    select: {
                        donation: true
                    }
                }
            }
        })
    ]);

    return {
        campaigns,
        donors
    };
}) satisfies PageServerLoad;
