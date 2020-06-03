import paymentService from "../services/payment";
import eventStoreService from "../clients/event-store";

class NATSStreamingWorker {
	#client;

	constructor(client) {
		this.#client = client;
	}

	activate() {
		this.listenAndProcessNewOrder();
	}

	listenAndProcessNewOrder() {
		const opts = this.#client.subscriptionOptions();
		opts.setDeliverAllAvailable();
		opts.setDurableName("durable_sub_order_created");

		const durableSub = this.#client.subscribe("order.created", opts);
		durableSub.on("message", async (msg)=> {
			const eventData = JSON.parse(msg.getData());
	
			const eventPayload = {
				event: "payment_confirmed",
				aggregate_id: eventData.id,
				aggregate_type: "order",
			};

			const res = await paymentService.processOrder(eventData)
			if (res instanceof Error) {
				eventPayload.event = "payment_declined";
				eventPayload.event_data = JSON.stringify({});
			}

			eventPayload.event_data = JSON.stringify(res);

			await new Promise((resolve, reject) => {
				eventStoreService.createEvent(eventPayload, async (err, resp) => {
					if (err) {
						reject(err);
					}

					resolve();
				});
			});
		});
	}
}

export default NATSStreamingWorker;