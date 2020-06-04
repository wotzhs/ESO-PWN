import OrderService from "../services/order";
import eventStoreService from "../clients/event-store";

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
				aggregate_id: eventData.event_id,
				aggregate_type: "order",
				event_data: JSON.stringify({ event_id: eventData.event_id }),
			};

			try {
				// update order to confirmed
				const res = OrderService.updateOrderStatusById({ id: eventData.event_id, status: "confirmed" });
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
		const opts = this.#client.subscriptionOptions();
		opts.setDeliverAllAvailable();
		opts.setDurableName("durable_sub_order_confirmed");

		const durableSub = this.#client.subscribe("payment.declined", opts);
		durableSub.on("message", async (msg)=> {
			const eventData = JSON.parse(msg.getData());

			const eventPayload = {
				event: "order_cancelled",
				aggregate_id: eventData.event_id,
				aggregate_type: "order",
				event_data: JSON.stringify({ event_id: eventData.event_id }),
			};

			try {
				// update order to confirmed
				const res = OrderService.updateOrderStatusById({ id:eventData.event_id, status: "cancelled" });
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

	processConfirmedOrder() {
		const opts = this.#client.subscriptionOptions();
		opts.setDeliverAllAvailable();
		opts.setDurableName("durable_sub_order_confirmed");

		const durableSub = this.#client.subscribe("order.confirmed", opts);
		durableSub.on("message", async (msg)=> {
			const eventData = JSON.parse(msg.getData());

			const eventPayload = {
				event: "order_delivered",
				aggregate_id: eventData.event_id,
				aggregate_type: "order",
				event_data: JSON.stringify({ event_id: eventData.event_id }),
			};

			try {
				// update order to confirmed
				const res = OrderService.updateOrderStatusById({ id:eventData.event_id, status: "delivered" });
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
}

export default NATSStreamingWorker;