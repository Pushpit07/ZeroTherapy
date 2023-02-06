import type { NextApiRequest, NextApiResponse } from "next";
import excuteQuery from "lib/db";
import { CONSTANTS } from "lib/constants";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	const { command } = req.body;
	const {
		query: { sessionId },
	} = req;

	let now = Math.floor(Date.now() / 1000);
	try {
		switch (command) {
			case "start":
				await excuteQuery({
					query: `UPDATE ama_sessions SET status = ${CONSTANTS.ACTIVE}, updated_at = ${now} WHERE session_id = ${sessionId}`,
					values: [],
				});
				break;
			case "pause":
				await excuteQuery({
					query: `UPDATE ama_sessions SET status = ${CONSTANTS.PAUSED}, updated_at = ${now} WHERE session_id = ${sessionId}`,
					values: [],
				});
				break;
			case "resume":
				await excuteQuery({
					query: `UPDATE ama_sessions SET status = ${CONSTANTS.ACTIVE}, updated_at = ${now} WHERE session_id = ${sessionId}`,
					values: [],
				});
				break;
			case "end":
				await excuteQuery({
					query: `UPDATE ama_sessions SET status = ${CONSTANTS.ENDED}, updated_at = ${now} WHERE session_id = ${sessionId}`,
					values: [],
				});
				break;
			default:
				console.log("Invalid command");
		}
		res.status(200).end();
	} catch (error: any) {
		res.status(500).send(error.reason || "Failed to update status");
	}
}
