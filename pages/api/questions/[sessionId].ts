import type { NextApiRequest, NextApiResponse } from "next";
import excuteQuery from "../../../lib/db";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	const {
		query: { sessionId },
	} = req;

	const result = await excuteQuery({
		query: "SELECT question_id, content, created_at, votes FROM ama_questions WHERE session_id = ? AND is_posted = ? ORDER BY votes DESC, created_at ASC",
		values: [sessionId, 1],
	});
	res.status(200).send(result);
}
