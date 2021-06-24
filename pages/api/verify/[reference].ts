import type { NextApiRequest, NextApiResponse } from "next";
import https from "https";

type Data = {
	name: string;
};

export default (req: NextApiRequest, res: NextApiResponse<Data>) => {
	const {
		query: { reference },
		method,
	} = req;

	// const options = {
	// 	hostname: "api.paystack.co",
	// 	port: 443,
	// 	path: "/transaction/verify/:reference",
	// 	method: "GET",
	// 	headers: {
	// 		Authorization: "Bearer SECRET_KEY",
	// 	},
	// };
	// https
	// 	.request(options, (res) => {
	// 		let data = "";
	// 		res.on("data", (chunk) => {
	// 			data += chunk;
	// 		});
	// 		res.on("end", () => {
	// 			console.log(JSON.parse(data));
	// 		});
	// 	})
	// 	.on("error", (error) => {
	// 		console.error(error);
	// 	});
	res.status(200).json({ name: reference as string });
};
