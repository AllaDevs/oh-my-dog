import { Role } from '$lib/enums';
import { genDogMedicalRecordPDF } from '$lib/pdf';
import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { dev } from '$app/environment';
import { prisma } from '$lib/server/prisma';


export const GET = (async ({ locals, params, setHeaders }) => {
    const { user } = await locals.auth.validateUser();
    if (!user) {
        throw error(401, 'No estás autorizado para ver este contenido');
    }

    const dog = await prisma.registeredDog.findUnique({
        where: {
            id: params.dog_id
        },
        include: {
            breed: true,
            medicalRecord: true,
            owner: true,
        }
    });
    if (!dog) {
        throw error(404, 'No se encontro el perro solicitado');
    }

    if (user.role === Role.CLIENT && user.userId !== dog.ownerId) {
        throw error(401, 'No estás autorizado para ver este contenido');
    }

    const pdf = await genDogMedicalRecordPDF(dog);

    setHeaders({
        'Content-Type': 'application/pdf',
        'Content-Length': pdf.size.toString(),
        'Last-Modified': new Date().toUTCString(),
        'Cache-Control': `public, max-age=${dev ? 500 : 30_000}`,
    });

    return new Response(pdf);
}) satisfies RequestHandler;
