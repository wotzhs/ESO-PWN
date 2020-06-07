import http from "http";
import "regenerator-runtime/runtime";
import axios from "axios";
import axiosHttpAdapter from "axios/lib/adapters/http";
axios.defaults.adapter = axiosHttpAdapter;

describe("create order with preapproved order description", () => {
	it("should return an id", async () => {
		let orderId;
		try {
			const res = await axios.post("http://localhost:3000", {
				"amount": 207.00,
				"description": "test top up e wallet"
			});
			orderId = res.data.id;
		} catch (e) {
			return e;
		}
		expect(orderId).toEqual(expect.any(String));
		expect.assertions(1);
	});

	it("order status should be delivered and is updated afterwards", async () => {
		let orderId;
		try {
			const res = await axios.post("http://localhost:3000", {
				"amount": 207.00,
				"description": "test top up e wallet"
			});
			orderId = res.data.id;
		} catch (e) {
			return e;
		}

		// sleep 500 ms for payment to be processed
		await new Promise(resolve => setTimeout(resolve, 500));

		let created_at;
		let updated_at;
		let status;
		try {
			const res = await axios.get(`http://localhost:3000?id=${orderId}`);
			created_at = new Date(res.data.created_at).getTime();
			updated_at = new Date(res.data.updated_at).getTime();
			status = res.data.status;
		} catch (e) {
			return e;
		}
		expect(status).toEqual("delivered");
		expect(created_at).toBeLessThan(updated_at);
		expect.assertions(2);
	});
});

describe("create order with predeclined order description", () => {
	it("should return an id", async () => {
		let orderId;
		try {
			const res = await axios.post("http://localhost:3000", {
				"amount": 207.00,
				"description": "xxx test top up e wallet"
			});
			orderId = res.data.id;
		} catch (e) {
			return e;
		}
		expect(orderId).toEqual(expect.any(String));
		expect.assertions(1);
	});

	it("order status should be cancelled and is updated afterwards", async () => {
		let orderId;
		try {
			const res = await axios.post("http://localhost:3000", {
				"amount": 207.00,
				"description": "xxx test top up e wallet"
			});
			orderId = res.data.id;
		} catch (e) {
			return e;
		}

		// sleep 500 ms for payment to be processed
		await new Promise(resolve => setTimeout(resolve, 500));

		let created_at;
		let updated_at;
		let status;
		try {
			const res = await axios.get(`http://localhost:3000?id=${orderId}`);
			created_at = new Date(res.data.created_at).getTime();
			updated_at = new Date(res.data.updated_at).getTime();
			status = res.data.status;
		} catch (e) {
			return e;
		}
		expect(status).toEqual("cancelled");
		expect(created_at).toBeLessThan(updated_at);
		expect.assertions(2);
	});
});

describe("create order without preapproved or predeclined order description", () => {
	it("should return an id", async () => {
		let orderId;
		try {
			const res = await axios.post("http://localhost:3000", {
				"amount": 207.00,
				"description": "xxx test top up e wallet"
			});
			orderId = res.data.id;
		} catch (e) {
			return e;
		}
		expect(orderId).toEqual(expect.any(String));
		expect.assertions(1);
	});

	it("There should be an order status and updated after it is created", async () => {
		let orderId;
		try {
			const res = await axios.post("http://localhost:3000", {
				"amount": 207.00,
				"description": "xxx test top up e wallet"
			});
			orderId = res.data.id;
		} catch (e) {
			return e;
		}

		// sleep 500 ms for payment to be processed
		await new Promise(resolve => setTimeout(resolve, 500));

		let created_at;
		let updated_at;
		let status;
		try {
			const res = await axios.get(`http://localhost:3000?id=${orderId}`);
			created_at = new Date(res.data.created_at).getTime();
			updated_at = new Date(res.data.updated_at).getTime();
			status = res.data.status;
		} catch (e) {
			return e;
		}
		expect([ "delivered", "cancelled" ]).toContain(status);
		expect(created_at).toBeLessThan(updated_at);
		expect.assertions(2);
	});
});