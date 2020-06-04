import Order from "../models/order";
import pool from "../db";
import eventStoreService from "../../clients/event-store";

class OrderService {
	static async createOrder(order) {
		if (order instanceof Order == false) {
			return Error(Order.INCORRECT_INSTANCE_MSG);
		}

		try {
			const res = await pool.query(
				`
				INSERT INTO orders (id, user_id, payee_id, description, amount, status)
				VALUES ($1, $2, $3, $4, $5, $6)
				RETURNING id;
				`,
				[ order.id, order.user_id, order.payee_id, order.description, order.amount, order.status ]
			);

			await new Promise((resolve, reject) => {
				const payload = {
					event: "order_created",
					aggregate_id: order.id,
					aggregate_type: "order",
					event_data: JSON.stringify(order),
				};

				eventStoreService.createEvent(payload, async (err, resp) => {
					if (err) {
						reject(err);
					}

					resolve();
				});
			});

			return res.rows[0];
		} catch (e) {
			return e;
		}
	}

	static async getOrderById(id) {
		try {
			const res = await pool.query("SELECT * FROM orders WHERE id = $1", [ id ]);
			return res.rows[0];
		} catch (e) {
			return e;
		}
	}

	static async updateOrderStatusById({ id, status }) {
		try {
			await pool.query(
				"UPDATE orders SET status=$1, updated_at=$2 WHERE id=$3",
				[ status, new Date().toISOString(), id ]
			);
		} catch (e) {
			return e;
		}
	}
}

export default OrderService;