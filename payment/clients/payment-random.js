import { v4 as uuidV4 } from "uuid";

class PaymentRandom {
	pay(eventData) {
		return Math.random() > 0.5 ? Error("payment declined") : { payment_ref: uuidV4() };
	}
}

export default PaymentRandom;