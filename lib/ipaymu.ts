import crypto from 'crypto';

export interface IPaymuConfig {
  va: string;
  apiKey: string;
  isProduction: boolean;
}

export const ipaymuConfig: IPaymuConfig = {
  va: process.env.IPAYMU_VA || '',
  apiKey: process.env.IPAYMU_API_KEY || '',
  isProduction: process.env.IPAYMU_IS_PRODUCTION === 'true',
};

export const IPAYMU_API_URL = ipaymuConfig.isProduction
  ? 'https://my.ipaymu.com/api/v2'
  : 'https://sandbox.ipaymu.com/api/v2';

/**
 * Generate signature for iPaymu API request
 */
function generateSignature(body: any, method: string): string {
  const jsonBody = JSON.stringify(body);
  const requestBody = crypto.createHash('sha256').update(jsonBody).digest('hex');
  const stringToSign = `${method}:${ipaymuConfig.va}:${requestBody}:${ipaymuConfig.apiKey}`;

  return crypto.createHmac('sha256', ipaymuConfig.apiKey)
    .update(stringToSign)
    .digest('hex');
}

export async function createPayment(params: {
  orderId: string;
  amount: number;
  customerDetails: {
    name: string;
    email: string;
    phone?: string;
  };
  product: string[];
  qty: number[];
  price: number[];
  returnUrl?: string;
  cancelUrl?: string;
  notifyUrl?: string;
}) {
  const body = {
    name: params.customerDetails.name,
    email: params.customerDetails.email,
    phone: params.customerDetails.phone || '081234567890',
    amount: params.amount,
    notifyUrl: params.notifyUrl || `${process.env.NEXT_PUBLIC_APP_URL}/api/webhooks/ipaymu`,
    returnUrl: params.returnUrl || `${process.env.NEXT_PUBLIC_APP_URL}/profile`,
    cancelUrl: params.cancelUrl || `${process.env.NEXT_PUBLIC_APP_URL}/pricing`,
    referenceId: params.orderId,
    product: params.product,
    qty: params.qty,
    price: params.price,
    description: `Payment for ${params.product.join(', ')}`,
  };

  const signature = generateSignature(body, 'POST');

  console.log('[iPaymu] Creating payment:', {
    url: `${IPAYMU_API_URL}/payment`,
    va: ipaymuConfig.va,
    body: { ...body, phone: '***' }, // Hide phone in logs
  });

  const response = await fetch(`${IPAYMU_API_URL}/payment`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'va': ipaymuConfig.va,
      'signature': signature,
    },
    body: JSON.stringify(body),
  });

  const result = await response.json();

  console.log('[iPaymu] Response:', {
    status: response.status,
    ok: response.ok,
    result,
  });

  if (!response.ok) {
    console.error('[iPaymu] API error:', result);
    throw new Error(`iPaymu API error: ${JSON.stringify(result)}`);
  }

  return result;
}

/**
 * Check transaction status
 */
export async function checkTransaction(transactionId: string) {
  const body = {
    transactionId,
  };

  const signature = generateSignature(body, 'POST');

  const response = await fetch(`${IPAYMU_API_URL}/transaction`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'va': ipaymuConfig.va,
      'signature': signature,
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`iPaymu API error: ${JSON.stringify(error)}`);
  }

  return response.json();
}

/**
 * Verify webhook callback from iPaymu
 */
export function verifyCallback(body: any, receivedSignature: string): boolean {
  const signature = generateSignature(body, 'POST');
  return signature === receivedSignature;
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
