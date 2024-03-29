import { prisma } from '$lib/server/prisma.js';
import type { AdoptionPostDisc } from '$lib/types';
import type { PageServerLoad } from './$types';


export const load = (async () => {
    const [adoptionPosts, breeds] = await prisma.$transaction([
        prisma.adoptionPost.findMany({
            include: {
                temporalDog: {
                    include: {
                        breed: true,
                    }
                },
                publisher: true,
                registeredDog: {
                    include: {
                        breed: true,
                    }
                }
            }
        }),
        prisma.breed.findMany()
    ]);

    const posts: AdoptionPostDisc[] = [];
    for (const post of adoptionPosts) {
        posts.push({
            ...post,
            dog: post.registered ? post.registeredDog! : post.temporalDog!,
        });
    }

    return {
        posts: posts,
        breeds: breeds
    };
}) satisfies PageServerLoad;
