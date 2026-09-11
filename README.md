# Paystack

Paystack checkout demonstration in Next.js with TypeScript, with a service enquiry
link to https://tinotech.co.za/services. This is a lead-generation demo, not a
standalone paid product. Live keys are rejected in the UI and verification API.
The visitor can enter any test amount; never use this demo to fulfil paid orders.
Product checkouts need server-created orders and exact product/amount/buyer binding,
as implemented in `tinotech-co-za/Money` (ChaseKit).

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
yarn type-check
yarn build
yarn audit --groups dependencies --level high
```
