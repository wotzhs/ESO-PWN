import express from "express";
import HttpStatus from "http-status-codes";
import Order from "../models/order";
import OrderService from "../services/order";

const router = express.Router();

router.get("/", (req, res, next) => {
	res.json("hello world");
});

router.post("/", async (req, res) => {
	const order = new Order(req.body);
	const errors = order.validate();
	if (errors) {
		res.status(HttpStatus.BAD_REQUEST);
		return res.json({ errors });
	}

	const resp = await OrderService.createOrder(order);
	if (resp instanceof Error) {
		console.log(resp);
		res.status(HttpStatus.INTERNAL_SERVER_ERROR);
		return res.json({ error: HttpStatus.getStatusText(HttpStatus.INTERNAL_SERVER_ERROR) });
	}

	res.json(resp);
});

export default router;
