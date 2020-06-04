import { v4 as uuidV4 } from "uuid";

class MockedPaymentProvider {
	#preApprovedPaymentsPrefixes = ["test"];

	pay(eventData) {
		for (let i=0; i<this.#preApprovedPaymentsPrefixes; i++) {
			// check if payment description starts with pre approved keyword
			if (eventData.description.startsWith(this.#preApprovedPaymentsPrefixes[i])) {
				return { payment_ref: uuidV4() };
			}

			// else return random result
			return Math.random() > 0.5 ? Error("payment declined") : { payment_ref: uuidV4() };
		}
	}
}

export default MockedPaymentProvider;