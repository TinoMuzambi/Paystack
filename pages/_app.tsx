import { useEffect } from "react"
import type { AppProps } from "next/app"
import Script from "next/script"
import posthog from "posthog-js"
import { PostHogProvider } from "posthog-js/react"

import "../sass/App.scss"

function MyApp({ Component, pageProps }: AppProps) {
	useEffect(() => {
		posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
			api_host: "/ingest",
			ui_host: "https://us.posthog.com",
			capture_exceptions: true,
			debug: process.env.NODE_ENV === "development",
		})
	}, [])

	return (
		<PostHogProvider client={posthog}>
			<Component {...pageProps} />
			<Script
				src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4288512793572771"
				crossOrigin="anonymous"
			/>
		</PostHogProvider>
	)
}

export default MyApp
