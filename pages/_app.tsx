import type { AppProps } from "next/app";

import "../sass/App.scss";
import { useEffect } from "react";
import posthog from "posthog-js";
import { PostHogProvider } from "posthog-js/react";

function MyApp({ Component, pageProps }: AppProps) {
  useEffect(() => {
    posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
      api_host: "https://paystack-blue.vercel.app/ingest",
      defaults: "2025-05-24",
      // Enable debug mode in development
      loaded: (posthog) => {
        if (process.env.NODE_ENV === "development") posthog.debug();
      },
    });
  }, []);

  return (
    <PostHogProvider client={posthog}>
      <Component {...pageProps} />;
    </PostHogProvider>
  );
}

export default MyApp;
