import { Role } from '$lib/enums';
import { genDogsMedicalRecordPDF } from '$lib/pdf';
import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { dev } from '$app/environment';
import { prisma } from '$lib/server/prisma';


export const GET = (async ({ locals, params, setHeaders }) => {
    const { user } = await locals.auth.validateUser();
    if (!user) {
        throw error(401, 'No estás autorizado para ver este contenido');
    }
    if (user.role === Role.CLIENT && user.userId !== params.client_id) {
        throw error(401, 'No estás autorizado para ver este contenido');
    }

    const client = await prisma.client.findUnique({
        where: {
            id: params.client_id
        },
        include: {
            dog: {
                include: {
                    breed: true,
                    medicalRecord: true,
            }
        }
    }});
    if (!client) {
        throw error(404, 'No se encontro el cliente solicitado');
    }

    const pdf = await genDogsMedicalRecordPDF(client);

    setHeaders({
        'Content-Type': 'application/pdf',
        'Content-Length': pdf.size.toString(),
        'Last-Modified': new Date().toUTCString(),
        'Cache-Control': `public, max-age=${dev ? 500 : 30_000}`,
    });

    return new Response(pdf);
}) satisfies RequestHandler;
