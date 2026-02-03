import crypto from 'crypto';

export interface MidtransConfig {
  serverKey: string;
  clientKey: string;
  isProduction: boolean;
}

export const midtransConfig: MidtransConfig = {
  serverKey: process.env.MIDTRANS_SERVER_KEY || '',
  clientKey: process.env.MIDTRANS_CLIENT_KEY || '',
  isProduction: process.env.MIDTRANS_IS_PRODUCTION === 'true',
};

export const MIDTRANS_API_URL = midtransConfig.isProduction
  ? 'https://api.midtrans.com'
  : 'https://api.sandbox.midtrans.com';

export const MIDTRANS_SNAP_URL = midtransConfig.isProduction
  ? 'https://app.midtrans.com/snap/v1/transactions'
  : 'https://app.sandbox.midtrans.com/snap/v1/transactions';

/**
 * Create Midtrans Snap token for payment
 */
export async function createSnapToken(params: {
  orderId: string;
  grossAmount: number;
  customerDetails: {
    email: string;
    firstName: string;
  };
  itemDetails: Array<{
    id: string;
    name: string;
    price: number;
    quantity: number;
  }>;
}) {
  const auth = Buffer.from(midtransConfig.serverKey + ':').toString('base64');

  const response = await fetch(MIDTRANS_SNAP_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Basic ${auth}`,
      Accept: 'application/json',
    },
    body: JSON.stringify({
      transaction_details: {
        order_id: params.orderId,
        gross_amount: params.grossAmount,
      },
      customer_details: params.customerDetails,
      item_details: params.itemDetails,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Midtrans API error: ${JSON.stringify(error)}`);
  }

  return response.json();
}

/**
 * Verify webhook signature from Midtrans
 */
export function verifySignature(
  orderId: string,
  statusCode: string,
  grossAmount: string,
  signatureKey: string
): boolean {
  const serverKey = midtransConfig.serverKey;
  const hash = crypto
    .createHash('sha512')
    .update(`${orderId}${statusCode}${grossAmount}${serverKey}`)
    .digest('hex');
  
  return hash === signatureKey;
}

/**
 * Get plan details by plan name
 */
export function getPlanDetails(planName: string) {
  const plans: Record<string, { name: string; price: number; duration: number }> = {
    '1month': { name: '1 Month Premium', price: 25000, duration: 30 },
    '3months': { name: '3 Months Premium', price: 70000, duration: 90 },
    '1year': { name: '1 Year Premium', price: 240000, duration: 365 },
  };

  return plans[planName] || null;
}
