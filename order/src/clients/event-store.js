import grpc from "grpc";
import { loadSync } from "@grpc/proto-loader";
import commonGrpcConfig from "../../../grpc-common-config";

const packageDef = loadSync("event/event_store.proto", commonGrpcConfig);
const { EventStoreService } = grpc.loadPackageDefinition(packageDef).event;

const EVENT_STORE_URL = process.env.EVENT_STORE_URL || "0.0.0.0:50051";

const eventStoreService = new EventStoreService(EVENT_STORE_URL, grpc.credentials.createInsecure());

export default eventStoreService;