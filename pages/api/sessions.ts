import type { NextApiRequest, NextApiResponse } from "next";
import excuteQuery from "../../lib/db";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	try {
		// get sessions from database
		const result = await excuteQuery({
			query: `SELECT session_id, name, hosts, description, created_at, updated_at, status, (access_code_hash IS NOT NULL) as req_access_code FROM ama_sessions WHERE status IN (1, 3) AND is_posted = 1 ORDER BY updated_at DESC`,
			values: [],
		});

		if (result) {
			res.status(200).send(result);
		} else {
			console.log("Unable to fetch AMA sessions");
			res.status(result.status).send(result);
		}
	} catch (error: any) {
		res.status(500).send(error);
	}
}
