import { v4 as uuidV4 } from "uuid";

class PaymentConfigurable {
	#preApprovedPayments = { "test": true };

	pay(eventData) {
		return this.#preApprovedPayments[eventData.description] ? { payment_ref: uuidV4() } : Error("Payment declined");
	}
}

export default PaymentConfigurable;