import type { NextApiRequest, NextApiResponse } from "next";
import excuteQuery from "lib/db";
import { getContract } from "lib/contract";
import { utils } from "ethers";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	const { questionId, root, nullifierHash, externalNullifier, solidityProof } = JSON.parse(req.body);
	const {
		query: { sessionId },
	} = req;

	const { contract, account } = await getContract();

	try {
		// send onchain
		await contract.methods
			.postQuestion(sessionId, questionId, utils.formatBytes32String("post"), root, nullifierHash, externalNullifier, solidityProof)
			.send({ from: account, gas: 6721900, gasPrice: 35000000000 });

		await excuteQuery({
			query: `UPDATE ama_questions SET is_posted = ${1} WHERE question_id = ${questionId}`,
			values: [],
		});
		res.status(200).end();
	} catch (error: any) {
		console.log(error);
		res.status(500).send(error.reason || "Failed to post question");
	}
}
