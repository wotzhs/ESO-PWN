import { v4 as uuidV4 } from "uuid";
import pool from "../db";
import sc from "../../clients/nats-streaming";

const eventToChannelMapping = {
	"order_created": "order.created",
	"payment_confirmed": "payment.confirmed",
	"payment_declined": "payment.declined",
	"order_confirmed": "order.confirmed",
	"order_cancelled": "order.cancelled",
	"order_delivered": "order.delivered",
};

class Service {
	static async createEvent({ event, aggregate_id, aggregate_type, event_data }) {
		try {
			const channel = eventToChannelMapping[event];
			if (!channel) {
				throw Error("invalid event");
			}

			const res = await pool.query(
				`
				INSERT INTO events (id, event, aggregate_id, aggregate_type, event_data)
				VALUES ($1, $2, $3, $4, $5)
				RETURNING id AS event_id;
				`,
				[ uuidV4(), event, aggregate_id, aggregate_type, event_data ]
			);

			await new Promise((resolve, reject) => {
				sc.publish(channel, event_data, (err, guid)=> {
					if (err) reject(err);
					resolve();
				});
			});

			return res.rows[0];
		} catch (e) {
			return e;
		}
	}
}

export default Service;