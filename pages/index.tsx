import { useEffect, useState } from "react";
import { usePaystackPayment } from "react-paystack";
import { PaystackProps } from "react-paystack/dist/types";

type referenceObj = {
	message: string;
	reference: string;
	status: "sucess" | "failure";
	trans: string;
	transaction: string;
	trxref: string;
};

export default function Home() {
	const [ref, setRef] = useState("");

	useEffect(() => {
		setRef("" + Math.floor(Math.random() * 1000000000 + 1));
	}, []);

	const config: PaystackProps = {
		reference: ref,
		email: "user@example.com",
		label: "Tino",
		amount: 20000,
		publicKey: process.env.PAYSTACK_PUBLIC_TEST_KEY as string,
		currency: "ZAR",
	};

	// you can call this function anything
	const onSuccess: Function = async (reference: referenceObj) => {
		// Implementation for whatever you want to do with reference and after success call.
		const res = await fetch(`/api/verify/${reference.reference}`);
		const json = await res.json();
		console.log(json);
		if (json.data.status === "success") alert("All done!");
	};

	// you can call this function anything
	const onClose: Function = () => {
		// implementation for  whatever you want to do when the Paystack dialog closed.
		console.log("closed");
	};

	const PaystackHookExample = () => {
		const initializePayment = usePaystackPayment(config);
		return (
			<div>
				<button
					onClick={() => {
						initializePayment(onSuccess, onClose);
					}}
				>
					Paystack Hooks Implementation
				</button>
			</div>
		);
	};

	return <PaystackHookExample />;
}
