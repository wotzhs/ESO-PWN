import PaymentConfigurable from "../clients/payment-configurable";
import PaymentRandom from "../clients/payment-random";

const PaymentClient = process.env.NODE_ENV == "dev" ? PaymentRandom : PaymentConfigurable;

class PaymentService {
	#client;

	constructor(client) {
		this.#client = client;
	}

	async processOrder(eventData) {
		try {
			return await this.#client.pay(eventData);
		} catch (e) {
			return e;
		}
	}
}

export default new PaymentService(new PaymentClient());