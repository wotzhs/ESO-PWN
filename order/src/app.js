import express from "express";
import path from "path";
import logger from "morgan";
import orderRouter from "./routes/orders";
import sc from "../clients/nats-streaming";
import NATSStreamingWorker from "./workers/nats-streaming";

const app = express();
const natsStreamingWorker = new NATSStreamingWorker(sc);
sc.on("connect", ()=>{
	app.use(logger("dev"));
	app.use(express.json());
	app.use(express.urlencoded({ extended: false }));

	app.use("/", orderRouter);

	natsStreamingWorker.activate();
});

export default app;
