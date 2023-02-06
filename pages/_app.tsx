import "../styles/globals.css";
import "../styles/custom.css";
import type { AppProps } from "next/app";
import { ReactSession } from "react-client-session";
import { HuddleClientProvider, getHuddleClient } from "@huddle01/huddle01-client";

function MyApp({ Component, pageProps }: AppProps) {
	const huddleClient = getHuddleClient(process.env.NEXT_PUBLIC_HUDDLE_API_KEY);
	ReactSession.setStoreType("memory");

	return (
		<HuddleClientProvider value={huddleClient}>
			<Component {...pageProps} />
		</HuddleClientProvider>
	);
}

export default MyApp;
