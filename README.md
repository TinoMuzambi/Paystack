# Paystack

Paystack functionality demo in Next.js with TypeScript.

## Environment

Copy `.env.example` to `.env.local`. The Paystack public test key and PostHog
project details are intentionally browser-visible. `PAYSTACK_SECRET_TEST_KEY` is
used only by the transaction-verification API route and must never be added to
`next.config.js` or given a `NEXT_PUBLIC_` prefix.

The verification endpoint returns only the transaction status, amount,
currency, and reference. Customer details from Paystack are never returned to
the browser or forwarded to analytics.

## Verification

```bash
yarn build
```
