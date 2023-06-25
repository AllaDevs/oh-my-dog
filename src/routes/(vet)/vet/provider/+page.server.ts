import { DogServiceType } from '$lib/enums';
import { prisma } from '$lib/server/prisma';
import type { PageServerLoad } from './$types';


export const load = (async (event) => {

    const providers = await prisma.dogServiceProvider.findMany();

    const walkers = providers.filter(provider => provider.type == DogServiceType.WALKING);
    const sitters = providers.filter(provider => provider.type == DogServiceType.SITTING);

    return { walkers, sitters };
}) satisfies PageServerLoad;
