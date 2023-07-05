import { CAMPAIGN_IMAGE_MAX_SIZE } from '$lib/config';
import { DonationCampaignState } from '$lib/enums';
import { donationCampaignRegisterSchema } from '$lib/schemas';
import { uploadImage } from '$lib/server/cloudinary';
import { prisma } from '$lib/server/prisma';
import { validateImage } from '$lib/utils/functions';
import { Prisma, type DonationCampaign } from '@prisma/client';
import { fail, redirect } from '@sveltejs/kit';
import { setError, superValidate } from 'sveltekit-superforms/server';
import type { Actions, PageServerLoad } from './$types';


export const load = (async (event) => {
    const form = await superValidate(donationCampaignRegisterSchema);

    return { form };
}) satisfies PageServerLoad;


export const actions = {
    register: async ({ request }) => {
        const formData = await request.formData();
        const form = await superValidate(formData, donationCampaignRegisterSchema);

        const formImage = validateImage(formData, form, 'banner', CAMPAIGN_IMAGE_MAX_SIZE)!;
        if (!form.valid) {
            console.error(form);
            return fail(400, { form });
        }

        let campaign: DonationCampaign;
        try {
            campaign = await prisma.donationCampaign.create({
                data: {
                    name: form.data.name,
                    description: form.data.description,
                    state: DonationCampaignState.CREATED,
                    banner: null
                }
            });
        }
        catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                if (error.code === "P2002") {
                    // TODO: check if the error is because of unique constraint?
                }
                return setError(form, '', 'Error con la base de datos al registrar la campaña de donacion, intente mas tarde');
            }
            throw error;
        }

        try {
            const bannerImage = await uploadImage(
                formImage,
                {
                    asset_folder: 'user',
                    public_id: `vet/donation_campaign/${campaign.id}`
                }
            );
            if (!bannerImage.success) {
                // TODO: inform of the failure and redirect as well?
                return setError(form, 'banner', 'Error al subir la imagen, carguela mas tarde');
            }

            await prisma.donationCampaign.update({
                where: {
                    id: campaign.id
                },
                data: {
                    banner: {
                        url: bannerImage.data.secure_url,
                        width: bannerImage.data.width,
                        height: bannerImage.data.height
                    }
                }
            });
        }
        catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                return setError(form, '', 'Ocurrio un error con la base de datos al subir la imagen, carguela mas tarde');
            }

            throw error;
        }

        throw redirect(303, `/vet/donation/campaign/${campaign.id}`);
    }
} satisfies Actions;
