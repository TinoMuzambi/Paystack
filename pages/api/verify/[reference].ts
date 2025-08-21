import type { NextApiRequest, NextApiResponse } from "next";
import fetch from "node-fetch";
import { PostHog } from "posthog-node";

type Data = {
  success: boolean;
  data?: Object;
};

// Initialize PostHog Node client
const posthog = new PostHog(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
  host: process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://us.i.posthog.com",
  flushAt: 1,
  flushInterval: 0,
});

export default async (req: NextApiRequest, resp: NextApiResponse<Data>) => {
  // Set CORS headers
  resp.setHeader("Access-Control-Allow-Origin", "*");
  resp.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  resp.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // Handle preflight requests
  if (req.method === "OPTIONS") {
    resp.status(200).end();
    return;
  }

  const {
    query: { reference },
  } = req;

  try {
    const res = await fetch(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_TEST_KEY}`,
        },
      }
    );
    const data: any = await res.json();

    // Track successful verification event
    posthog.capture({
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
    posthog.capture({
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
    await posthog.shutdown();
  }
};
