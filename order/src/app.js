import express from "express";
import path from "path";
import logger from "morgan";
import orderRouter from "./routes/orders";

const app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/", orderRouter);

export default app;
