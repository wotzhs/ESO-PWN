import { v4 as uuidV4 } from "uuid";
import pool from "../db";

class Service {
	static async createEvent({ event, aggregate_id, aggregate_type, event_data }) {
		try {
			console.log(JSON.parse(event_data));
			const res = await pool.query(
				`
				INSERT INTO events (id, event, aggregate_id, aggregate_type, event_data)
				VALUES ($1, $2, $3, $4, $5)
				RETURNING id AS event_id;
				`,
				[ uuidV4(), event, aggregate_id, aggregate_type, event_data ]
			);
			return res.rows[0];
		} catch (e) {
			return e;
		}
	}
}

export default Service;