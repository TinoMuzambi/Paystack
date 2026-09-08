import type { NextApiRequest, NextApiResponse } from "next";

import { PostHog } from "posthog-node";

type Data = {
  success: boolean;
  data?: Object;
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
  if (!reference || !/^[A-Za-z0-9._-]+$/.test(reference)) {
    return resp.status(400).json({ success: false });
  }
  if (!secretKey) {
    return resp.status(503).json({ success: false });
  }

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
        headers: {
          Authorization: `Bearer ${secretKey}`,
        },
      }
    );
    const data: any = await res.json();

    // Track successful verification event
    posthog?.capture({
      distinctId: reference as string,
      event: "payment_verified",
      properties: {
        reference,
        status: data.data.status,
        amount: data.data.amount,
      },
    });

    resp.status(200).json({ success: true, data: data.data });
  } catch (error) {
    // Track failed verification event
    posthog?.capture({
      distinctId: typeof reference === "string" ? reference : "",
      event: "payment_verification_failed",
      properties: {
        reference,
        error: error instanceof Error ? error.message : String(error),
      },
    });

    resp.status(400).json({ success: false });
  } finally {
    // Ensure PostHog client is properly shut down
    await posthog?.shutdown();
  }
};
