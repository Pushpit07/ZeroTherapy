import Web3 from "web3";
import config from "./config.json";
import AMA from "artifacts/contracts/AMA.sol/AMA.json";
import { AbiItem } from "web3-utils";

const getContract = async () => {
	let env = process.env.NODE_ENV;

	// set RPC URL and PTE KEY based on env
	const RPC_URL = env == "development" ? process.env.MUMBAI_TESTNET_RPC_URL : process.env.MUMBAI_MAINNET_RPC_URL;
	const PTE_KEY = env == "development" ? "0x" + process.env.PRIVATE_KEY : "0x" + process.env.PRIVATE_KEY;

	const web3 = new Web3(RPC_URL as string);
	web3.eth.handleRevert = true; // return custom error messages from contract

	let hmyMasterAccount = web3.eth.accounts.privateKeyToAccount(PTE_KEY as string);
	web3.eth.accounts.wallet.add(hmyMasterAccount);
	web3.eth.defaultAccount = hmyMasterAccount.address;

	const contract = new web3.eth.Contract(AMA.abi as AbiItem[], config.AMA_CONTRACT_ADDRESS);
	return { contract, account: web3.eth.defaultAccount };
};

export { getContract };
