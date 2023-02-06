import { useEffect } from "react";
import { huddleIframeApp, HuddleAppEvent, HuddleIframe, IframeConfig } from "@huddle01/huddle01-iframe";

const HuddleFrame = ({ sessionId }: any) => {
	// const [walletAddress, setWalletAddress] = useState("");
	const iframeConfig: IframeConfig = {
		roomUrl: "https://iframe.huddle01.com/" + sessionId,
		height: "610px",
		width: "100%",
	};

	// const reactions = ["😂", "😢", "😦", "😍", "🤔", "👀", "🙌", "👍", "👎", "🔥", "🍻", "🚀", "🎉", "❤️", "💯"];

	useEffect(() => {
		huddleIframeApp.on(HuddleAppEvent.PEER_JOIN, (data) => console.log({ iframeData: data }));
		huddleIframeApp.on(HuddleAppEvent.PEER_LEFT, (data) => console.log({ iframeData: data }));
	}, []);

	return (
		<div className="huddle_container">
			{/* <div>
				<br />
				{Object.keys(huddleIframeApp.methods)
					.filter((key) => !["sendReaction", "connectWallet"].includes(key))
					.map((key) => (
						<button
							key={key}
							onClick={() => {
								huddleIframeApp.methods[key as HuddleClientMethodName]();
							}}
						>
							{key}
						</button>
					))}
			</div> */}

			<HuddleIframe config={iframeConfig} />

			{/* <br /> */}
			{/* {reactions.map((reaction) => (
				<button key={reaction} onClick={() => huddleIframeApp.methods.sendReaction(reaction)}>
					{reaction}
				</button>
			))} */}

			{/* <input type="text" value={walletAddress} onChange={(e) => setWalletAddress(e.target.value)} placeholder="Wallet Address" />
			<button onClick={() => huddleIframeApp.methods.connectWallet(walletAddress)}>Connect Wallet</button> */}
		</div>
	);
};

export default HuddleFrame;
