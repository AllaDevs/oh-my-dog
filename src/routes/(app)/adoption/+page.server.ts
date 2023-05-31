import { prisma } from '$lib/server/prisma.js';
import type { AdoptionPost, RegisteredDog, TemporalDog } from '@prisma/client';
import type { PageServerLoad } from './$types';


// type SelectField<T extends Record<string, unknown>, DK extends keyof T, OK1 extends keyof T, OK2 extends keyof T> =
//     T[DK] extends true ? T[OK1] extends null | Record<string, unknown> ? never : Omit<T, OK1> & Record<OK1, T[OK1]> : T[OK2] extends null ? never : T & Record<OK2, T[OK2]> ;

// type MapFields<T extends Record<string, unknown>[]> = SelectField<T[number], 'registered', 'registeredDog', 'temporalDog'>[];

// // a generic type to map each element of the array to a new type given the array type and the mapper type
// type MapArray<T extends readonly unknown[], M extends (v: T[number]) => unknown> = {
//     [K in keyof T]: M extends (v: T[K]) => infer R ? R : never;
// };

// type SelectField<T extends Record<string, unknown>, D extends keyof T, OK1 extends keyof T, OK2 extends keyof T> =
//   T[D] extends true
//     ? T[OK1] extends null | Record<string, unknown>
//       ? never
//       : Omit<T, OK1> & Record<OK1, T[OK1]>
//     : T[OK2] extends null
//     ? never
//     : T & Record<OK2, T[OK2]>;
type MakeFieldRequired<T, D, K1 extends keyof T, K2 extends keyof T> = D extends true ? T & Required<Pick<T, K1>> : T & Required<Pick<T, K2>>;

type MapFields<T extends Record<string, unknown>[]> = MakeFieldRequired<T[number], 'registered', 'registeredDog', 'temporalDog'>[];

type AdoptionPosts = (AdoptionPost & ({
    registered: true,
    registeredDog: RegisteredDog,
} | {
    registered: false,
    temporalDog: TemporalDog,
}))[];

// type DiscriminateUnion<T extends Record<string, unknown>, D extends keyof T, OK1 extends keyof T, OK2 extends keyof T> =
//     Omit<T, OK1 | OK2> | T[D] extends true ? Record<OK1, T[OK1] & {}> | Record<D, true> : T[D] extends false ? Record<OK2, T[OK2] & {}>  | Record<D, false> : never;

// type MapPosts<T extends Record<string, unknown>[]> = DiscriminateUnion<T[number], 'registered', 'registeredDog', 'temporalDog'>[];

export const load = (async ({ locals }) => {
    const adoptionPosts = await prisma.adoptionPost.findMany({
        include: {
            temporalDog: true,
            publisher: true,
            registeredDog: true,
        }
    });

    return {
        posts: adoptionPosts as AdoptionPosts,
    };
}) satisfies PageServerLoad;
