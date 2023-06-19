import { dev } from '$app/environment';
import { NGROK_URL } from '$lib/config';
import { DonationCampaignState, Role } from '$lib/enums';
import { campaignDonationSchema } from '$lib/schemas';
import { mp } from '$lib/server/mercadopago';
import { prisma } from '$lib/server/prisma';
import { error, fail, redirect } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms/server';
import { getDonationStatus } from '../../donationShared';
import type { Actions, PageServerLoad } from './$types';


export const load = (async ({ params, url }) => {
    const campaign = await prisma.donationCampaign.findUnique({
        where: {
            id: params.campaign_id
        }
    });

    if (!campaign) {
        throw error(404, 'No se encontro la campaña de donacion');
    }

    if (campaign.state !== DonationCampaignState.ACTIVE) {
        throw error(400, 'La campaña ya no esta vigente');
    }

    const donationForm = await superValidate(campaignDonationSchema);

    const donationStatus = getDonationStatus(url);

    return {
        campaign,
        donationForm,
        donationStatus
    };
}) satisfies PageServerLoad;


export const actions = {
    donate: async ({ locals, request, url, params }) => {
        const form = await superValidate(request, campaignDonationSchema);
        if (!form.valid) {
            return fail(400, { donationForm: form });
        }

        const { user } = await locals.auth.validateUser();

        const backUrl = url.origin + url.pathname;
        const notificationUrl = `${(dev ? NGROK_URL : url.origin)}/api/donation/mercadopago`;

        const paymentPayload = {
            items: [
                {
                    title: `Donacion hacia la veterinaria ¡Oh my dog!`,
                    unit_price: form.data.amount,
                    currency_id: "ARS",
                    quantity: 1,
                    category_id: "donation"
                }
            ],
            payment_methods: {
                excluded_payment_types: [
                    { id: "bank_transfer" },
                    { id: "ticket" },
                    { id: "prepaid_card" }
                ],
                installments: 1,
            },
            back_urls: {
                success: backUrl,
                failure: backUrl,
            },
            statement_descriptor: "Veterinaria ¡Oh my dog!",
            notification_url: notificationUrl,
            auto_return: "approved",
            // @ts-expect-error
            metadata: {
                client_id: user && user.role === Role.CLIENT ? user.userId : undefined,
                campaign_id: params.campaign_id
            }
        } satisfies Parameters<typeof mp.preferences.create>[0];

        const mpResult = await mp.preferences.create(paymentPayload);

        const checkoutURL = mpResult.body.init_point as string;

        throw redirect(303, checkoutURL);
    },
} satisfies Actions;
