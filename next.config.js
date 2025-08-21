module.exports = {
  env: {
    PAYSTACK_PUBLIC_TEST_KEY: process.env.PAYSTACK_PUBLIC_TEST_KEY,
    PAYSTACK_SECRET_TEST_KEY: process.env.PAYSTACK_SECRET_TEST_KEY,
    NEXT_PUBLIC_POSTHOG_KEY: process.env.NEXT_PUBLIC_POSTHOG_KEY,
    NEXT_PUBLIC_POSTHOG_HOST: process.env.NEXT_PUBLIC_POSTHOG_HOST,
  },
  async rewrites() {
    return [
      {
        source: "/ingest/:path*",
        destination: "https://us.i.posthog.com/:path*",
      },
    ];
  },
};
