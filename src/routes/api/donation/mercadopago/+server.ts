import { DonationReason } from '$lib/enums';
import { mp } from '$lib/server/mercadopago';
import { prisma } from '$lib/server/prisma';
import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';


export const POST = (async ({ request, url }) => {
    console.log("API ENDPOINT\n", await request.json(), "\n", url.href);

    const type = url.searchParams.get('type');
    if (!type) {
        throw error(500, 'Invalid request');
    }

    if (type === "payment") {
        const id = url.searchParams.get('data.id');
        if (!id) {
            throw error(500, 'Invalid request, missing payment id');
        }

        const payment = await mp.payment.findById(id as unknown as number);

        const clientId = payment.body.metadata.client_id ?? undefined;
        const campaignId = payment.body.metadata.campaign_id ?? undefined;
        const donation = await prisma.donation.create({
            data: {
                amount: payment.body.transaction_amount,
                reason: campaignId ? DonationReason.CAMPAIGN : DonationReason.GENERAL,
                campaingId: campaignId,
                clientId: clientId
            }
        });

        console.log(`Successfull donation:\n${JSON.stringify(payment.body, null, 2)}\n${JSON.stringify(donation, null, 2)}`);
    }

    return new Response(null, { status: 204 });
}) satisfies RequestHandler;
