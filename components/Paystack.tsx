import posthog from "posthog-js";
import { useEffect, useState } from "react";
import { PaystackButton } from "react-paystack";
import { PaystackProps } from "react-paystack/dist/types";

type referenceObj = {
  message: string;
  reference: string;
  status: "sucess" | "failure";
  trans: string;
  transaction: string;
  trxref: string;
};

const Paystack: React.FC = (): JSX.Element => {
  const [ref, setRef] = useState("");
  const [email, setEmail] = useState("");
  const [amount, setAmount] = useState(0);
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    setSuccess(false);
    posthog.capture("successfulPayment", {
      email,
      name,
      surname,
      amount,
    });
    setRef("" + Math.floor(Math.random() * 1000000000 + 1));
  }, [success]);

  const config: PaystackProps = {
    reference: ref,
    email: email,
    firstname: name,
    lastname: surname,
    label: name + " " + surname,
    amount: (amount * 100) | 0,
    publicKey: process.env.PAYSTACK_PUBLIC_TEST_KEY as string,
    currency: "ZAR",
  };

  const onSuccess = async (reference: referenceObj) => {
    const res = await fetch(`/api/verify/${reference.reference}`);
    const verifyData = await res.json();

    if (verifyData.data.status === "success") {
      setSuccess(true);

      setEmail("");
      setAmount(0);
      setName("");
      setSurname("");
    }
  };

  const onClose = () => {
    alert("Payment cancelled.");
  };

  const componentProps = {
    ...config,
    text: `Pay R${amount | 0}`,
    onSuccess,
    onClose,
  };

  return (
    <div className="glass-card">
      {success && (
        <div className="success-message">
          Payment successful! Thank you for your transaction.
        </div>
      )}
      <div id="paymentForm">
        <div className="form-group">
          <label htmlFor="email">Email Address</label>
          <input
            type="email"
            id="email-address"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
          />
        </div>
        <div className="form-group">
          <label htmlFor="amount">Amount (R)</label>
          <input
            type="number"
            step="0.01"
            min={0}
            id="amount"
            required
            value={amount}
            onChange={(e) => setAmount(Number.parseFloat(e.target.value))}
            placeholder="0.00"
          />
        </div>
        <div className="form-group">
          <label htmlFor="first-name">First Name</label>
          <input
            type="text"
            id="first-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your first name"
          />
        </div>
        <div className="form-group">
          <label htmlFor="last-name">Last Name</label>
          <input
            type="text"
            id="last-name"
            value={surname}
            onChange={(e) => setSurname(e.target.value)}
            placeholder="Enter your last name"
          />
        </div>

        <PaystackButton {...componentProps} />
      </div>
    </div>
  );
};

export default Paystack;
