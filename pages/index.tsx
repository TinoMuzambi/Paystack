import Head from "next/head";
import dynamic from "next/dynamic";

import Banner from "../components/Banner";

const Paystack = dynamic(() => import("../components/Paystack"), {
  ssr: false,
});

const Home: React.FC = (): JSX.Element => {
  return (
    <>
      <Head>
        <title>Paystack checkout demo | tinotech</title>
        <meta name="description" content="Try a safe Paystack test checkout, then ask tinotech to integrate payments on your business website." />
      </Head>
      <div className="background-elements"></div>
      <main>
        <Banner />
        <Paystack />
      </main>
    </>
  );
};

export default Home;
