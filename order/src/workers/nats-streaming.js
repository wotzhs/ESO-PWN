import OrderService from "../services/order";
import eventStoreService from "../../clients/event-store";

class NATSStreamingWorker {
	#client;

	constructor(client) {
		this.#client = client;
	}

	activate() {
		this.processConfirmedPayment();
		this.processDeclinedPayment();
		this.processConfirmedOrder();
	}

	processConfirmedPayment() {
		const opts = this.#client.subscriptionOptions();
		opts.setDeliverAllAvailable();
		opts.setDurableName("durable_sub_payment_confirmed");

		const durableSub = this.#client.subscribe("payment.confirmed", opts);
		durableSub.on("message", async (msg)=> {
			const eventData = JSON.parse(msg.getData());
	
			const eventPayload = {
				event: "order_confirmed",
				aggregate_id: eventData.aggregate_id,
				aggregate_type: "order",
				event_data: JSON.stringify({}),
			};

			try {
				// update order to confirmed
				const res = OrderService.updateOrderStatusById({ id:eventData.aggregate_id, status: "confirmed" });
				if (res instanceof Error) {
					console.log(res);
					// TODO: publish to error channel and requeue to be reprocessed (not within assessment scope)
				}

				await new Promise((resolve, reject) => {
					eventStoreService.createEvent(eventPayload, async (err, resp) => {
						if (err) {
							reject(err);
						}

						resolve();
					});
				});
			} catch (e) {
				console.log(e);
				// TODO: publish to error channel and requeue to be reprocessed (not within assessment scope)
			}
		});
	}

	processDeclinedPayment() {
	}

	processConfirmedOrder() {
	}
}

export default NATSStreamingWorker;