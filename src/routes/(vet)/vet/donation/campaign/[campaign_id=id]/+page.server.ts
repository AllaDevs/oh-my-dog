import { DonationCampaignState } from '$lib/enums';
import { donationCampaignUpdateSchema } from '$lib/schemas';
import { redirectToLogin } from '$lib/server/auth';
import { uploadImage } from '$lib/server/cloudinary';
import { prisma } from '$lib/server/prisma';
import { validateImage } from '$lib/utils/functions';
import type { DonationCampaign, Image } from '@prisma/client';
import { error, fail, redirect } from '@sveltejs/kit';
import { setError, superValidate } from 'sveltekit-superforms/server';
import { z } from 'zod';
import type { Actions, PageServerLoad } from './$types';


const startCampaignSchema = z.object({});
const pauseCampaignSchema = z.object({});
const endCampaignSchema = z.object({});


export const load = (async ({ locals, params, url }) => {
    const { user } = await locals.auth.validateUser();
    if (!user) {
        throw redirect(303, redirectToLogin(url));
    }

    const campaign = await prisma.donationCampaign.findUnique({
        where: {
            id: params.campaign_id
        },
        include: {
            donation: {
                include: {
                    client: {
                        select: {
                            id: true,
                            firstname: true,
                            lastname: true
                        }
                    }
                }
            }
        }
    });

    if (!campaign) {
        throw error(404, 'No se encontro la campaña de donacion');
    }

    if (campaign.banner) {
        campaign.banner = campaign.banner.url as any;
    }

    const [updateForm, startForm, pauseForm, endForm] = await Promise.all([
        superValidate(campaign, donationCampaignUpdateSchema, { id: 'update' }),
        superValidate(startCampaignSchema, { id: 'start' }),
        superValidate(pauseCampaignSchema, { id: 'pause' }),
        superValidate(endCampaignSchema, { id: 'end' })
    ]);

    return {
        campaign,
        updateForm,
        startForm,
        pauseForm,
        endForm
    };
}) satisfies PageServerLoad;


export const actions = {
    start: async ({ request, locals, params }) => {
        const { user } = await locals.auth.validateUser(); // as Required<{user:Lucia.User}>;
        const form = await superValidate(request, startCampaignSchema, { id: 'start' });
        if (!form.valid) {
            return fail(400, { form });
        }

        if (!user) {
            setError(form, '', 'Debes iniciar sesión para empezar la campaña de donacion');
            return fail(401, { form });
        }

        try {
            const result = await prisma.donationCampaign.updateMany({
                where: {
                    id: params.campaign_id,
                    state: {
                        in: [
                            DonationCampaignState.CREATED,
                            DonationCampaignState.PAUSED,
                        ]
                    }
                },
                data: {
                    state: DonationCampaignState.ACTIVE
                },

            });
            if (result.count === 0) {
                throw error(500, 'No existe la campaña de donacion que quieres empezar ' + params.campaign_id);
            }
        }
        catch (err) {
            console.error(err);
            // TODO: handle deletion errors
            throw error(500, 'Ocurrio un error al empezar la campaña de donacion');
        }

        return { form };
    },
    pause: async ({ request, locals, params }) => {
        const { user } = await locals.auth.validateUser(); // as Required<{user:Lucia.User}>;
        const form = await superValidate(request, startCampaignSchema, { id: 'pause' });
        if (!form.valid) {
            return fail(400, { form });
        }

        if (!user) {
            setError(form, '', 'Debes iniciar sesión para pausar la campaña de donacion');
            return fail(401, { form });
        }

        try {
            const result = await prisma.donationCampaign.updateMany({
                where: {
                    id: params.campaign_id,
                    state: DonationCampaignState.ACTIVE
                },
                data: {
                    state: DonationCampaignState.PAUSED
                },

            });
            if (result.count === 0) {
                throw error(500, 'No existe la campaña de donacion que quieres pausar ' + params.campaign_id);
            }
        }
        catch (err) {
            console.error(err);
            // TODO: handle deletion errors
            throw error(500, 'Ocurrio un error al pausar la campaña de donacion');
        }

        return { form };
    },
    end: async ({ request, locals, params }) => {
        const { user } = await locals.auth.validateUser(); // as Required<{user:Lucia.User}>;
        const form = await superValidate(request, startCampaignSchema, { id: 'end' });
        if (!form.valid) {
            return fail(400, { form });
        }

        if (!user) {
            setError(form, '', 'Debes iniciar sesión para terminar la campaña de donacion');
            return fail(401, { form });
        }

        try {
            const result = await prisma.donationCampaign.updateMany({
                where: {
                    id: params.campaign_id
                },
                data: {
                    state: DonationCampaignState.ENDED,
                    endDate: new Date()
                },

            });
            if (result.count === 0) {
                throw error(500, 'No existe la campaña de donacion que quieres terminar ' + params.campaign_id);
            }
        }
        catch (err) {
            console.error(err);
            // TODO: handle deletion errors
            throw error(500, 'Ocurrio un error al terminar la campaña de donacion');
        }

        return { form };
    },
    update: async ({ request, url, locals, params }) => {
        const { user } = await locals.auth.validateUser(); // as Required<{user:Lucia.User}>;
        const formData = await request.formData();
        const form = await superValidate(formData, donationCampaignUpdateSchema, { id: 'update' });
        const formImage = validateImage(formData, form, 'banner')!;
        if (!form.valid) {
            return fail(400, { form });
        }

        if (!user) {
            setError(form, '', 'Debes iniciar sesión para terminar la campaña de donacion');
            return fail(401, { form });
        }

        let campaign: DonationCampaign | null;
        try {
            campaign = await prisma.donationCampaign.findUnique({
                where: {
                    id: params.campaign_id
                },
            });
        }
        catch (err) {
            console.error(err);
            //TODO: handle update errors
            throw error(500, 'Ocurrio un error al eliminar el post');
        }

        if (!campaign) {
            throw error(404, 'No se encontro el post de adopción que quieres actualizar');
        }
        if (campaign.state === DonationCampaignState.ENDED) {
            return setError(form, '', 'La campaña ya fue terminada');
        }

        let image: Image | undefined;
        if (formImage) {
            try {
                const dogImage = await uploadImage(
                    formImage,
                    {
                        asset_folder: 'user',
                        public_id: `vet/donation_campaign/${campaign.id}`
                    }
                );
                if (dogImage.success) {
                    image = {
                        width: dogImage.data.width,
                        height: dogImage.data.height,
                        url: dogImage.data.secure_url
                    };
                }
                else {
                    setError(form, 'banner', 'Error al subir la imagen, carguela mas tarde');
                }
            }
            catch (err) {
                console.error(err);
                //TODO: handle update errors
                throw error(500, 'Ocurrio un error al eliminar el post');
            }
        }

        try {
            await prisma.donationCampaign.update({
                where: {
                    id: campaign.id
                },
                data: {
                    name: form.data.name,
                    description: form.data.description,
                    banner: image
                }
            });
        }
        catch (err) {
            console.error(err);
            //TODO: handle update errors
            throw error(500, 'Ocurrio un error al eliminar el post');
        }

        return { updateForm: form };
    },
} satisfies Actions;
