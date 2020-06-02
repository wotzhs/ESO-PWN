import grpc from "grpc";
import Service from "../services";

class Routes {
	static async createEvent(call, callback) {
		const res = await Service.createEvent(call.request);
		if (res instanceof Error) {
			console.log(res);
			return callback({
				code: grpc.status.INTERNAL,
				details: res.message,
			});
		}

		callback(null, { "event_id": res });
	}
}

export default Routes;