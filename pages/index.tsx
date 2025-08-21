import Head from "next/head";

import Paystack from "../components/Paystack";
import Banner from "../components/Banner";

const Home: React.FC = (): JSX.Element => {
  return (
    <>
      <Head>
        <title>Paystack Playground</title>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
      </Head>
      <main>
        <Banner />
        <Paystack />
      </main>
    </>
  );
};

export default Home;
