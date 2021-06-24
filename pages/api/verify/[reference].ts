import type { NextApiRequest, NextApiResponse } from "next";
import https from "https";

type Data = {
	success: boolean;
	data?: Object;
};

export default (req: NextApiRequest, res: NextApiResponse<Data>) => {
	const {
		query: { reference },
		method,
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
				});
				res.on("end", () => {
					console.log(JSON.parse(data));
				});
			})
			.on("error", (error) => {
				console.error(error);
			});
		res.status(200).json({ success: true, data: data });
	} catch (error) {
		res.status(400).json({ success: false });
	}
};
