import { DonationReason } from '$lib/enums';
import { prisma } from '$lib/server/prisma';
import type { PageServerLoad } from './$types';


export const load = (async () => {
    const generalDonations = await prisma.donation.findMany({
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
    });

    return {
        generalDonations
    };
}) satisfies PageServerLoad;
