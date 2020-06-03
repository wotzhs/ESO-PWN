import grpc from "grpc";
import { loadSync } from "@grpc/proto-loader";
import commonGrpcConfig from "../../grpc-common-config";

const packageDef = loadSync("event/event_store.proto", commonGrpcConfig);
const { EventStoreService } = grpc.loadPackageDefinition(packageDef).event;

const GRPC_SERVER_IP = process.env.GRPC_SERVER_IP || "0.0.0.0";
const EVENT_PORT = process.env.EVENT_PORT || "50051";

const eventStoreService = new EventStoreService(`${GRPC_SERVER_IP}:${EVENT_PORT}`, grpc.credentials.createInsecure());

export default eventStoreService;