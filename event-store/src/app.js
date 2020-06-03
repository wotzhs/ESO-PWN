import grpc from "grpc";
import { loadSync } from "@grpc/proto-loader";
import commonGrpcConfig from "../../grpc-common-config";
import Routes from "./routes";
import sc from "../clients/nats-streaming";

const packageDef = loadSync("event/event_store.proto", commonGrpcConfig);
const { EventStoreService } = grpc.loadPackageDefinition(packageDef).event;

const server = new grpc.Server();

server.addService(EventStoreService.service, {
	createEvent: Routes.createEvent,
});

const SERVER_IP = process.env.SERVER_IP || "0.0.0.0";
const SERVER_PORT = process.env.SERVER_PORT || "50051";

sc.on("connect", () => {
	server.bind(`${SERVER_IP}:${SERVER_PORT}`, grpc.ServerCredentials.createInsecure());
	server.start();
});

