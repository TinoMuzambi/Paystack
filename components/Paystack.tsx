import posthog from "posthog-js";
import { useEffect, useState } from "react";
import { PaystackButton } from "react-paystack";
import { PaystackProps } from "react-paystack/dist/types";

type referenceObj = {
  message: string;
  reference: string;
  status: "success" | "failure";
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
  const [message, setMessage] = useState("");

  // Initialize reference and reset success state on mount
  useEffect(() => {
    setSuccess(false);
    setRef(window.crypto.randomUUID());
  }, []);

  const config: PaystackProps = {
    reference: ref,
    email: email,
    firstname: name,
    lastname: surname,
    label: name + " " + surname,
    amount: Math.round(amount * 100),
    publicKey: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_TEST_KEY as string,
    currency: "ZAR",
  };

  const onSuccess = (reference: referenceObj) => {
    setMessage("");
    fetch(`/api/verify/${reference.reference}`)
      .then((res) => res.json())
      .then((verifyData) => {
        if (verifyData.success && verifyData.data?.status === "success") {
          posthog.capture("successfulPayment", {
            amount: verifyData.data.amount,
            currency: verifyData.data.currency,
          });
          setSuccess(true);
          setRef(window.crypto.randomUUID());
          setEmail("");
          setAmount(0);
          setName("");
          setSurname("");
        } else {
          setMessage("The test payment could not be verified. Please try again.");
          posthog.capture("failedPayment", {
            amount,
          });
        }
      })
      .catch(() => setMessage("Verification is temporarily unavailable. Please try again."));
  };

  const onClose = () => {
    posthog.capture("cancelledPayment", {
      amount,
    });
    setMessage("Test checkout cancelled.");
  };

  const componentProps = {
    ...config,
    text: `Test pay R${Number.isFinite(amount) ? amount.toFixed(2) : "0.00"}`,
    onSuccess,
    onClose,
  };

  // Validate required fields before rendering the button
  const isFormValid =
    email &&
    Number.isFinite(amount) &&
    amount > 0 &&
    amount <= 1000000 &&
    name &&
    surname &&
    process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_TEST_KEY?.startsWith("pk_test_");

  return (
    <div className="glass-card">
      <h1>Try a Paystack checkout</h1>
      <p>This is a test checkout demonstration. It does not sell a product or accept live payments.</p>
      <p><a href="https://tinotech.co.za/services">Need checkout on your website? View tinotech services.</a></p>
      {message && <p role="status">{message}</p>}
      {success && (
        <div className="success-message">
          Test payment verified. No product was purchased.
        </div>
      )}
      <div id="paymentForm">
        <div className="form-group">
          <label htmlFor="email-address">Email Address</label>
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
            max={1000000}
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

        {isFormValid ? (
          <PaystackButton {...componentProps} />
        ) : (
          <button
            type="button"
            disabled
            style={{
              padding: "10px 20px",
              backgroundColor: "#ccc",
              color: "#666",
              border: "none",
              borderRadius: "5px",
              cursor: "not-allowed",
            }}
          >
            Please fill all fields to proceed
          </button>
        )}
      </div>
    </div>
  );
};

export default Paystack;
