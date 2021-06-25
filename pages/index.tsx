import { FormEventHandler, useEffect, useState } from "react";
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
	const [success, setSuccess] = useState(false);

	useEffect(() => {
		setSuccess(false);
		setRef("" + Math.floor(Math.random() * 1000000000 + 1));
	}, [success]);

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

		if (json.data.status === "success") {
			setSuccess(true);
			alert("All done!");
		}
	};

	// you can call this function anything
	const onClose: Function = () => {
		// implementation for  whatever you want to do when the Paystack dialog closed.
		console.log("closed");
	};

	const handleSubmit: FormEventHandler<HTMLFormElement> = (e) => {
		e.preventDefault();
		const initializePayment = usePaystackPayment(config);
		initializePayment(onSuccess, onClose);
	};

	const PaystackHookExample = () => {
		return (
			<main>
				<form id="paymentForm" onSubmit={handleSubmit}>
					<div className="form-group">
						<label htmlFor="email">Email Address</label>
						<input type="email" id="email-address" required />
					</div>
					<div className="form-group">
						<label htmlFor="amount">Amount</label>
						<input type="tel" id="amount" required />
					</div>
					<div className="form-group">
						<label htmlFor="first-name">First Name</label>
						<input type="text" id="first-name" />
					</div>
					<div className="form-group">
						<label htmlFor="last-name">Last Name</label>
						<input type="text" id="last-name" />
					</div>
					<div className="form-submit">
						<button type="submit">Paystack Hooks Implementation</button>
					</div>
				</form>
			</main>
		);
	};

	return <PaystackHookExample />;
}
