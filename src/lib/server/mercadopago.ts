import { MERCADOPAGO_TOKEN } from '$env/static/private';
import mercadopago from 'mercadopago';


mercadopago.configure({
    access_token: MERCADOPAGO_TOKEN
});

type MercadoPago = typeof mercadopago & {
    payment_methods: {
        listAll(): Promise<{
            body: Record<string, any>[],
            response: Record<string, any>[];
        }>;
    };
};

export const mp = mercadopago as MercadoPago;


async function listPaymentMethods() {
    console.info((await mp.payment_methods.listAll()).body.map(p => ({
        id: p.id,
        payment_type_id: p.payment_type_id,
        status: p.status
    })));
}
/*
payment types
    { id: "debit_card" },
    { id: "credit_card" },
    { id: "bank_transfer" },
    { id: "ticket" },
    { id: "prepaid_card" }
*/
