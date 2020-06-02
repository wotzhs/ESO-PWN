import Order from "../models/order";
import pool from "../db";

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
}

export default OrderService;