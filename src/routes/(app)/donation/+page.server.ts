import { dev } from '$app/environment';
import { NGROK_URL } from '$lib/config';
import { DonationCampaignState } from '$lib/enums';
import { generalDonationSchema } from '$lib/schemas';
import { mp } from '$lib/server/mercadopago';
import { prisma } from '$lib/server/prisma';
import { fail, redirect } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms/server';
import type { Actions, PageServerLoad } from './$types';
import { getDonationStatus } from './donationShared';


export const load = (async ({ url }) => {
    const campaigns = await prisma.donationCampaign.findMany({
        where: {
            state: DonationCampaignState.ACTIVE
        }
    });

    const generalForm = await superValidate(generalDonationSchema);

    const donationStatus = getDonationStatus(url);

    return {
        campaigns,
        generalForm,
        donationStatus
    };
}) satisfies PageServerLoad;


export const actions = {
    generalDonation: async ({ locals, request, params, url }) => {
        const form = await superValidate(request, generalDonationSchema);
        if (!form.valid) {
            return fail(400, { generalForm: form });
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
                client_id: user?.userId,
                campaign_id: undefined
            }
        } satisfies Parameters<typeof mp.preferences.create>[0];

        const mpResult = await mp.preferences.create(paymentPayload);

        const checkoutURL = mpResult.body.init_point as string;

        throw redirect(303, checkoutURL);
    },
} satisfies Actions;
