import type { NextApiRequest, NextApiResponse } from "next";
import fetch from "node-fetch";

type Data = {
	success: boolean;
	data?: Object;
};

export default async (req: NextApiRequest, resp: NextApiResponse<Data>) => {
	const {
		query: { reference },
	} = req;

	const options = {
		hostname: "api.paystack.co",
		port: 443,
		path: `/transaction/verify/${reference}`,
		method: "GET",
		headers: {
			Authorization: `Bearer ${process.env.PAYSTACK_SECRET_TEST_KEY}`,
		},
	};
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
		const data = await res.json();
		resp.status(200).json({ success: true, data: data.data });
	} catch (error) {
		console.error("oh nooo", error);
		resp.status(400).json({ success: false });
	}
};
