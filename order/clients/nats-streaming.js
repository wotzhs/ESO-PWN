import { connect } from "node-nats-streaming";

const clusterId = process.env.NATS_STREAMING_CLUSTER_ID || "dev";
const clientId = process.env.NATS_STREAMING_CLIENT_ID || "order";
const natsUrl = process.env.NATS_STREAMING_SERVER_URL || "nats://0.0.0.0:4222";

const connectionOptions = {
	url: natsUrl,
	ackTimeout: 3000,
	name: clientId,
};

const sc = connect(clusterId, clientId, connectionOptions);

export default sc;