import mysql from "serverless-mysql";

const db = mysql({
	config: {
		host: "zero-therapy.ci8njdhu2cf2.us-east-1.rds.amazonaws.com",
		port: 3306,
		database: "zero_therapy_db",
		user: "admin",
		password: "zero-therapy-buidl-it-2022",
	},
});
export default async function excuteQuery({ query, values }) {
	try {
		const results = await db.query(query, values);
		await db.end();
		return results;
	} catch (error) {
		return { error };
	}
}
