import { DonationReason, PaymentPlatform } from '$lib/enums';
import { mp } from '$lib/server/mercadopago';
import { prisma } from '$lib/server/prisma';
import { Prisma } from '@prisma/client';
import { error } from '@sveltejs/kit';
import type { PaymentGetResponse } from 'mercadopago/resources/payment';
import type { RequestHandler } from './$types';


export const POST = (async ({ request, url }) => {
    console.info("API ENDPOINT\n", await request.json(), "\n", url.href);

    const type = url.searchParams.get('type');
    if (!type) {
        throw error(500, 'Invalid request');
    }

    if (type === "payment") {
        const id = url.searchParams.get('data.id');
        if (!id) {
            throw error(500, 'Invalid request, missing payment id');
        }

        let payment: PaymentGetResponse;
        try {
            payment = await mp.payment.findById(Number(id));
        }
        catch (err) {
            if ((err as Record<string, any>).status === 404) {
                console.error("Payment wasnt registered, unkown reason\n", JSON.stringify(err, null, 2));
                throw error(500, 'Invalid request, not a valid payment id?');
            }

            throw error(500, 'something went wrong');
        }

        const clientId = payment.body.metadata.client_id ?? undefined;
        const campaignId = payment.body.metadata.campaign_id ?? undefined;

        try {
            const donation = await prisma.donation.create({
                data: {
                    amount: payment.body.transaction_amount,
                    paymentId: id,
                    paymentPlatform: PaymentPlatform.MERCADOPAGO,
                    reason: campaignId ? DonationReason.CAMPAIGN : DonationReason.GENERAL,
                    campaingId: campaignId,
                    clientId: clientId
                }
            });
            if (clientId) {
                await prisma.client.update({
                    where: {
                        id: clientId,
                    },
                    data: {
                        discountAmount: {
                            increment: donation.amount
                        }
                    }
                });
            }
            console.info(`Successfull donation:\n${JSON.stringify(donation, null, 2)}`);
            // console.info(`Successfull donation:\n${JSON.stringify(payment.body, null, 2)}\n${JSON.stringify(donation, null, 2)}`);
        }
        catch (err) {
            console.error(err, "\nError during donation notification handling");
            if (err instanceof Prisma.PrismaClientKnownRequestError) {
                return new Response(null, { status: 204 });
            }
            throw err;
        }
    }

    return new Response(null, { status: 204 });
}) satisfies RequestHandler;
