import { usePaystackPayment } from "react-paystack";
import { PaystackProps } from "react-paystack/dist/types";

export default function Home() {
	const config: PaystackProps = {
		reference: new Date().getTime().toLocaleString(),
		email: "user@example.com",
		label: "Tino",
		amount: 20000,
		publicKey: process.env.PAYSTACK_PUBLIC_KEY as string,
		currency: "ZAR",
	};

	// you can call this function anything
	const onSuccess: Function = (reference: string) => {
		// Implementation for whatever you want to do with reference and after success call.
		console.log(reference);
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
