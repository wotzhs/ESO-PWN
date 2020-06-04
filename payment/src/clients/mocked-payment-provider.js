import { v4 as uuidV4 } from "uuid";

class MockedPaymentProvider {
	#preApprovedPaymentsPrefixes = ["test"];
	#preDeclinedPaymentsPrefixes = ["xxx"]

	pay(eventData) {
		// check if payment description starts with pre approved keyword
		for (let i=0; i<this.#preApprovedPaymentsPrefixes.length; i++) {
			if (eventData.description.startsWith(this.#preApprovedPaymentsPrefixes[i])) {
				return { payment_ref: uuidV4() };
			}
		}

		// check if payment description starts with pre declined keyword
		for (let i=0; i<this.#preDeclinedPaymentsPrefixes.length; i++) {
			if (eventData.description.startsWith(this.#preDeclinedPaymentsPrefixes[i])) {
				return Error("payment declined");
			}
		}

		// else return random result
		return Math.random() > 0.5 ? Error("payment declined") : { payment_ref: uuidV4() };
	}
}

export default MockedPaymentProvider;