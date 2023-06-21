import { DogServiceType } from '$lib/enums';
import { prisma } from '$lib/server/prisma';
import type { PageServerLoad } from './$types';



export const load: PageServerLoad = async (event) => {

    const providers = await prisma.dogServiceProvider.findMany({
        select: {
            id: true,
            email: true,
            firstname: true,
            lastname: true,
            workingHour: true,
            type: true,
            areas: true
        }
    });

    const walkers = providers.filter(provider => provider.type == DogServiceType.WALKING);
    const sitters = providers.filter(provider => provider.type == DogServiceType.SITTING);

    return { walkers, sitters };
};
