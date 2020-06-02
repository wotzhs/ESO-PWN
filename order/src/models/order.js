import { v4 as uuidV4 } from "uuid";

class Order {
	static INCORRECT_INSTANCE_MSG = "Argument order is not an instance of Order";

	constructor({ amount, description }) {
		this.id = uuidV4();
		this.amount = amount;
		this.user_id = uuidV4(); // assume user_id is obtained from a service not within this assessment's scope
		this.payee_id = uuidV4(); // assume payee_id is obtained from a service not within this assessment's scope
		this.description = description;
		this.status = "created";
	}

	validate() {
		const error = {};
		if (!this.amount) {
			error.amount = ["amount must not be empty"];
		}

		if (isNaN(this.amount)) {
			error.amount = [ ...(error.amount || []), "amount must be in number format" ];
		}

		if (!this.description) {
			error.description = "description must not be empty";
		}

		return Object.keys(error).length > 0 ? error : null;
	}
}

export default Order;