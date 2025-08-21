import Head from "next/head";

import Paystack from "../components/Paystack";
import Banner from "../components/Banner";

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
