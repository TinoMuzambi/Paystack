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
        <title>Paystack Playground</title>
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
