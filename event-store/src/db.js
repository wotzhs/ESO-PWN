import { Pool, types } from "pg";

types.setTypeParser(1114, (str) => {
	const utcStr = `${str}Z`;
	return new Date(utcStr).toISOString();
});

const pool = new Pool({
	connectionString: process.env.EVENT_DB_URL,
});

export default pool;