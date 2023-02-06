import type { NextApiRequest, NextApiResponse } from "next";
import { CONSTANTS } from "lib/constants";
import { BigNumber, utils } from "ethers";
import excuteQuery from "lib/db";
import { getContract } from "lib/contract";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	const { identityCommitment, accessCode } = req.body;
	const {
		query: { sessionId },
	} = req;

	// verify that the access code is valid
	let accessCodeHash: string = "";
	let result;
	if (accessCode) {
		accessCodeHash = utils.keccak256(utils.toUtf8Bytes(accessCode));
		result = await excuteQuery({
			query: `SELECT session_id FROM ama_sessions WHERE session_id = ${sessionId} AND status IN (${CONSTANTS.ACTIVE}, ${CONSTANTS.PAUSED}) AND (access_code_hash IS NULL OR access_code_hash = ${accessCodeHash})`,
			values: [],
		});
	} else {
		result = await excuteQuery({
			query: `SELECT session_id FROM ama_sessions WHERE session_id = ${sessionId} AND status IN (${CONSTANTS.ACTIVE}, ${CONSTANTS.PAUSED}) AND (access_code_hash IS NULL)`,
			values: [],
		});
	}

	console.log(result);

	if (result && result.length > 0) {
		// join AMA session (a.k.a Semaphore Group)
		const { contract, account } = await getContract();

		console.log("account address:", account);

		try {
			const _result = await contract.methods.joinAmaSession(sessionId, BigNumber.from(identityCommitment)).send({
				from: account,
				gas: 6721900,
				gasPrice: 35000000000,
			});
			console.log("_result:", _result);

			res.status(200).end();
		} catch (error: any) {
			console.log(error);
			res.status(500).send("Failed to join session");
		}
	} else {
		res.status(500).send("Invalid access code. Please obtain access code from the counselor.");
	}
}
