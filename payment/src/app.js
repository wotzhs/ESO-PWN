import sc from "./clients/nats-streaming";
import NATSStreamingWorker from "./workers/nats-streaming";

sc.on("connect", ()=> {
	const natsWorker = new NATSStreamingWorker(sc);
	natsWorker.activate();
});