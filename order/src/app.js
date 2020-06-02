import express from "express";
import path from "path";
import logger from "morgan";
import indexRouter from "./routes/index";

var app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/", indexRouter);

export default app;
