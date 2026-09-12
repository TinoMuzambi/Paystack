import type { NextApiRequest, NextApiResponse } from "next";

import { PostHog } from "posthog-node";

type Data = {
  success: boolean;
  data?: {
    amount: number;
    currency: string;
    reference: string;
    status: string;
  };
};

export default async (req: NextApiRequest, resp: NextApiResponse<Data>) => {
  if (req.method !== "GET") {
    resp.setHeader("Allow", "GET");
    return resp.status(405).json({ success: false });
  }

  const reference = Array.isArray(req.query.reference)
    ? req.query.reference[0]
    : req.query.reference;
  const secretKey = process.env.PAYSTACK_SECRET_TEST_KEY;
  if (
    !reference ||
    !/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
      reference
    )
  ) {
    return resp.status(400).json({ success: false });
  }
  if (!secretKey?.startsWith("sk_test_")) {
    return resp.status(503).json({ success: false });
  }

  resp.setHeader("Cache-Control", "no-store");

  const posthogKey = process.env.NEXT_PUBLIC_POSTHOG_KEY;
  const posthog = posthogKey
    ? new PostHog(posthogKey, {
        host: process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://us.i.posthog.com",
        flushAt: 1,
        flushInterval: 0,
      })
    : null;

  try {
    const res = await fetch(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        method: "GET",
        signal: AbortSignal.timeout(10000),
        cache: "no-store",
        headers: {
          Authorization: `Bearer ${secretKey}`,
        },
      }
    );
    const payload: any = await res.json();
    if (!res.ok || payload?.status !== true || !payload?.data || payload.data.reference !== reference || payload.data.domain !== "test" || payload.data.currency !== "ZAR") {
      console.error("Paystack verification failed", res.status);
      return resp.status(502).json({ success: false });
    }

    const data = {
      amount: Number(payload.data.amount) || 0,
      currency: String(payload.data.currency || ""),
      reference: String(payload.data.reference || reference),
      status: String(payload.data.status || "failed"),
    };

    // Never send customer details or the full provider response to analytics.
    posthog?.capture({
      distinctId: reference as string,
      event: "payment_verified",
      properties: {
        reference,
        status: data.status,
        amount: data.amount,
        currency: data.currency,
      },
    });

    return resp.status(200).json({
      success: data.status === "success",
      data,
    });
  } catch {
    // Track failed verification event
    posthog?.capture({
      distinctId: typeof reference === "string" ? reference : "",
      event: "payment_verification_failed",
      properties: {
        reference,
      },
    });

    return resp.status(502).json({ success: false });
  } finally {
    // Ensure PostHog client is properly shut down
    try { await posthog?.shutdown(); } catch { /* Analytics must not change the verification result. */ }
  }
};
