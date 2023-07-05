import { dev } from '$app/environment';
import { Role } from '$lib/enums';
import { genDogMedicalRecordPDF } from '$lib/pdf';
import { prisma } from '$lib/server/prisma';
import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';


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

    const filename = `${dog.owner.lastname.toUpperCase()}_omd_hm_${Date.now()}.pdf`;

    setHeaders({
        'Content-Type': 'application/pdf',
        'Content-Length': pdf.size.toString(),
        'Last-Modified': new Date().toUTCString(),
        'Cache-Control': `private, max-age=${dev ? 2 : 60}`,
        'Content-Disposition': `attachment; filename="${filename}"`
    });

    return new Response(pdf);
}) satisfies RequestHandler;
