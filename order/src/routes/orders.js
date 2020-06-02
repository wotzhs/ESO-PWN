import express from "express";
import HttpStatus from "http-status-codes";
import Order from "../models/order";
import OrderService from "../services/order";

const router = express.Router();

router.get("/", async (req, res) => {
	const { id } = req.query;
	if (!id) {
		res.status(HttpStatus.BAD_REQUEST);
		return res.json({ error: "id param must not be empty" });
	}

	const resp = await OrderService.getOrderById(id);
	if (resp instanceof Error) {
		console.log(resp);
		res.status(HttpStatus.INTERNAL_SERVER_ERROR);
		return res.json({ error: HttpStatus.getStatusText(HttpStatus.INTERNAL_SERVER_ERROR) });
	}

	res.json(resp);
});

router.post("/", async (req, res) => {
	const order = new Order(req.body);
	const error = order.validate();
	if (error) {
		res.status(HttpStatus.BAD_REQUEST);
		return res.json({ error });
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
