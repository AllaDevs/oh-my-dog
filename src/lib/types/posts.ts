import type { AdoptionPost, Breed, Client, RegisteredDog, TemporalDog } from '@prisma/client';


export type AdoptionPostDiscriminated = AdoptionPost & ({
    registered: true,
    registeredDog: RegisteredDog,
} | {
    registered: false,
    temporalDog: TemporalDog,
});

export type AdoptionPostDiscriminatedComplete = (AdoptionPost & {
    publisher: Client,
} & ({
    registered: true,
    registeredDog: RegisteredDog & {
        breed: {
            name: string,
        };
    },
} | {
    registered: false,
    temporalDog: TemporalDog & {
        breed: {
            name: string,
        };
    },
}));

export type AdoptionPostDisc = (
    AdoptionPost &
    {
        publisher: Client,
    } &
    (
        {
            registered: true,
            dog: RegisteredDog & {
                breed: Breed;
            },
        } | {
            registered: false,
            dog: TemporalDog & {
                breed: Breed;
            },
        }
    )
);
