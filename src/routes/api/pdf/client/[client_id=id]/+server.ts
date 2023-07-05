import { dev } from '$app/environment';
import { Role } from '$lib/enums';
import { genDogsMedicalRecordPDF } from '$lib/pdf';
import { prisma } from '$lib/server/prisma';
import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';


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
        }
    });
    if (!client) {
        throw error(404, 'No se encontro el cliente solicitado');
    }

    const pdf = await genDogsMedicalRecordPDF(client);

    const filename = `${client.lastname.toUpperCase()}_omd_hm_${Date.now()}.pdf`;

    setHeaders({
        'Content-Type': 'application/pdf',
        'Content-Length': pdf.size.toString(),
        'Last-Modified': new Date().toUTCString(),
        'Cache-Control': `private, max-age=${dev ? 2 : 60}`,
        'Content-Disposition': `attachment; filename="${filename}"`
    });

    return new Response(pdf);
}) satisfies RequestHandler;
