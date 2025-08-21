import type { NextApiRequest, NextApiResponse } from "next";
import fetch from "node-fetch";
import PostHogClient from "../../../lib/posthog";

type Data = {
	success: boolean;
	data?: Object;
};

// Initialize PostHog Node client
const posthog = PostHogClient();

export default async (req: NextApiRequest, resp: NextApiResponse<Data>) => {
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
		await posthog.capture({
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
		await posthog.capture({
			distinctId: typeof reference === "string" ? reference : "",
			event: "payment_verification_failed",
			properties: {
				reference,
				error: error instanceof Error ? error.message : String(error),
			},
		});

		resp.status(400).json({ success: false });
	}
};