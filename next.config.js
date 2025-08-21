module.exports = {
  env: {
    PAYSTACK_PUBLIC_TEST_KEY: process.env.PAYSTACK_PUBLIC_TEST_KEY,
    PAYSTACK_SECRET_TEST_KEY: process.env.PAYSTACK_SECRET_TEST_KEY,
  },

  async rewrites() {
    return [
      {
        source: "/ingest/static/:path*",
        destination: "https://us-assets.i.posthog.com/static/:path*",
      },
      {
        source: "/ingest/:path*",
        destination: "https://us.i.posthog.com/:path*",
      },
      {
        source: "/decide/:path*",
        destination: "https://us.i.posthog.com/decide/:path*",
      },
    ];
  },

  skipTrailingSlashRedirect: true,
};
