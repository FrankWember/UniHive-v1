import axios from 'axios';

const PAYPAL_CLIENT_ID = process.env.NEXT_PRIVATE_PAYPAL_CLIENT_ID!;
const PAYPAL_SECRET = process.env.PAYPAL_SECRET!;
const PAYPAL_API_URL = process.env.PAYPAL_BASE_URL!;

async function getAccessToken() {
    const response = await axios.post(`${PAYPAL_API_URL}/v1/oauth2/token`, null, {
        auth: {
            username: PAYPAL_CLIENT_ID,
            password: PAYPAL_SECRET,
        },
        params: {
            grant_type: 'client_credentials',
        },
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
    });
    return response.data.access_token;
}

export async function createPaypalSubscription(userId: string, planId: string) {
    const accessToken = await getAccessToken();
    const response = await axios.post(`${PAYPAL_API_URL}/v1/billing/subscriptions`, {
        plan_id: planId,
        subscriber: {
            name: {
                given_name: 'John',
                surname: 'Doe',
            },
            email_address: 'customer@example.com',
        },
        application_context: {
            brand_name: 'Your Brand',
            locale: 'en-US',
            shipping_preference: 'NO_SHIPPING',
            user_action: 'SUBSCRIBE_NOW',
            return_url: `${process.env.NEXT_PUBLIC_BASE_URL}/home/services/billing/success`,
            cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/home/services/billing`,
        },
    }, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
        },
    });
    return response.data;
}

interface PurchaseItem {
    name: string,
    description?: string,
    quantity: number,
    unit_amount: {
        currency_code: string,
        value: string,
    },
}

interface ResponseLink {
    href: string,
    rel: string,
}


export async function makePaypalPayment({
    items, 
    amount, 
    shipping=0, 
    taxes=0, 
    currency_code='USD',
    shippingPreference='NO_SHIPPING',
}: {
    items:PurchaseItem[], 
    amount: number, 
    shipping: number, 
    taxes: number,
    currency_code: string
    shippingPreference: string
}) {
    const accessToken = await getAccessToken();
    const response = await axios.post(`${PAYPAL_API_URL}/v2/checkout/orders`, {
        intent: 'sale',
        payer: {
            payment_method: 'paypal',
        },
        purchase_units: [{
            items: items,
            amount: {
                currency_code: currency_code,
                value: amount.toString(),
                breakdown: {
                    item_total: {
                        currency_code: currency_code,
                        value: amount.toString(),
                    },
                    shipping: {
                        currency_code: currency_code,
                        value: shipping.toString(),
                    },
                    tax_total: {
                        currency_code: currency_code,
                        value: taxes.toString(),
                    },
                },
            }
        }],
        redirect_urls: {
            return_url: `${process.env.NEXT_PUBLIC_BASE_URL}/home/products/payment/success`,
            cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/home/products/payment/cancel`,
        },
        application_context: {
            brand_name: 'DormBiz Store',
            locale: 'en-US',
            shipping_preference: shippingPreference,
            user_action: 'PAY_NOW',
            return_url: `${process.env.NEXT_PUBLIC_BASE_URL}/home/products/payment/success`,
            cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/home/products/payment/cancel`,
        },
    }, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
        },
    });
    return response.data.links.find((link: ResponseLink) => link.rel === 'approval_url').href;
}

export async function capturePaypalPayment(orderId: string) {
    const accessToken = await getAccessToken();
    const response = await axios.post(`${PAYPAL_API_URL}/v2/checkout/orders/${orderId}/capture`, null, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
        },
    });
    return response.data;
}