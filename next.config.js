module.exports = {
  env: {
    PAYSTACK_PUBLIC_TEST_KEY: process.env.PAYSTACK_PUBLIC_TEST_KEY,
    PAYSTACK_SECRET_TEST_KEY: process.env.PAYSTACK_SECRET_TEST_KEY,
  },
  skipTrailingSlashRedirect: true,
};
