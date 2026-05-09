import crypto from "crypto";

const SAFEPAY_BASE =
  process.env.SAFEPAY_ENV === "production"
    ? "https://api.getsafepay.com"
    : "https://sandbox.api.getsafepay.com";

const SAFEPAY_CHECKOUT_BASE =
  process.env.SAFEPAY_ENV === "production"
    ? "https://getsafepay.com"
    : "https://sandbox.api.getsafepay.com";

interface SafepaySession {
  token: string;
  redirect_url: string;
}

export async function createSafepaySession({
  amount,
  orderId,
  successUrl,
  cancelUrl,
}: {
  amount: number;
  orderId: string;
  successUrl: string;
  cancelUrl: string;
}): Promise<SafepaySession> {
  // Step 1: Get auth token
  const authRes = await fetch(`${SAFEPAY_BASE}/order/v1/init`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      client_id: process.env.SAFEPAY_API_KEY,
      environment: process.env.SAFEPAY_ENV === "production" ? "production" : "sandbox",
      amount: amount * 100, // Safepay uses paisa (cents)
      currency: "PKR",
      order_id: orderId,
    }),
  });

  if (!authRes.ok) {
    const errText = await authRes.text();
    throw new Error(`Safepay init failed: ${errText}`);
  }

  const authData = await authRes.json();
  const tracker = authData.data?.token;

  if (!tracker) {
    throw new Error("No token received from Safepay");
  }

  // Step 2: Build checkout URL
  const checkoutUrl = new URL(`${SAFEPAY_CHECKOUT_BASE}/checkout/pay`);
  checkoutUrl.searchParams.set("beacon", tracker);
  checkoutUrl.searchParams.set("entry_mode", "hosted");
  checkoutUrl.searchParams.set("source", "custom");
  checkoutUrl.searchParams.set("redirect_url", successUrl);
  checkoutUrl.searchParams.set("cancel_url", cancelUrl);

  return {
    token: tracker,
    redirect_url: checkoutUrl.toString(),
  };
}

export function verifySafepayWebhook(
  payload: string,
  signature: string
): boolean {
  const secret = process.env.SAFEPAY_WEBHOOK_SECRET!;
  const expectedSignature = crypto
    .createHmac("sha256", secret)
    .update(payload)
    .digest("hex");
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSignature)
  );
}
