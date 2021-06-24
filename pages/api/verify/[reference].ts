import type { NextApiRequest, NextApiResponse } from "next";
import fetch from "node-fetch";

type Data = {
	success: boolean;
	data?: Object;
};

export default (req: NextApiRequest, resp: NextApiResponse<Data>) => {
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
		let data = "";
		https
			.request(options, (res) => {
				res.on("data", (chunk) => {
					data += chunk;
					console.log("chunk", JSON.parse(chunk));
				});
				res.on("end", () => {
					console.log("data", JSON.parse(data));
					resp.status(200).json({ success: true, data: data });
				});
			})
			.on("error", (error) => {
				console.error("oh no", error);
				resp.status(400).json({ success: false });
			});
	} catch (error) {
		console.error("oh nooo", error);
		resp.status(400).json({ success: false });
	}
};
