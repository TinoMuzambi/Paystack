import Head from "next/head";

import Paystack from "../components/Paystack";

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
				<Paystack />
			</main>
		</>
	);
};

export default Home;
