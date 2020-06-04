import MockedPaymentProvider from "../clients/mocked-payment-provider";

// TODO: if prod env use real payment provider client (not within the assessment scope)
const PaymentClient = process.env.NODE_ENV != "prod" ? MockedPaymentProvider : null;

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