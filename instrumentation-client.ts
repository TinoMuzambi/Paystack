import posthog from "posthog-js";

posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
  api_host: "https://paystack-blue.vercel.app/ingest",
  defaults: "2025-05-24",
  // Enable debug mode in development
  loaded: (posthog) => {
    if (process.env.NODE_ENV === "development") posthog.debug();
  },
});
