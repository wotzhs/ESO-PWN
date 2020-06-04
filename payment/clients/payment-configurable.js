import { v4 as uuidV4 } from "uuid";

class PaymentConfigurable {
	#preApprovedPaymentsPrefixes = ["test"];

	pay(eventData) {
		for (let i=0; i<this.#preApprovedPaymentsPrefixes; i++) {
			return eventData.description.startsWith(this.#preApprovedPaymentsPrefixes[i]) 
					? { payment_ref: uuidV4() } 
					: Error("Payment declined");
		}
	}
}

export default PaymentConfigurable;