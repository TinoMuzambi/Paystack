import { usePaystackPayment } from "react-paystack";

export default function Home() {
	const config = {
		reference: new Date().getTime(),
		email: "user@example.com",
		amount: 20000,
		publicKey: process.env.PAYSTACK_PUBLIC_KEY,
		currency: "ZAR",
	};

	// you can call this function anything
	const onSuccess = (reference) => {
		// Implementation for whatever you want to do with reference and after success call.
		console.log(reference);
	};

	// you can call this function anything
	const onClose = () => {
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
