# ESO-PWN

Event Sourcing Order-Payment with NATS

## <a name="getting-started"></a>Table of Contents

+ [Application Overview](#application-overview)
+ [Development](#development)
+ [Integration Test](#integration-test)
+ [Kubernetes](#kubernetes)

### <a name="application-overview"></a>Application Overview
```
                                     ===============
                                     | event-store |
                                     ===============
                                      /          \
                                   grpc          grpc    
                                    /              \
   =============     -->     =========    --->    ===========
   | front-end |  GET, POST  | order |    nats    | payment |
   =============     <--     =========    <---    ===========
```
**Application Flow**
1. **Order service** acts as the main api gateway, 
2. **Front-end** applications send POST request to `/` to create order.
3. **Order service** records the request in its own `db` and calls `event-store`'s `createEvent` grpc method.
4. **Event-store** saves the create event request in the `events` table and then publishes `order_created` onto the `nats-streaming` network.
5. **Payment service** is subscribed to `order_created` event and processes the payment, and create events via call to `event-store`'s `createEvent` grpc method.
6. **Event-store** publishes `payment_confirmed` if order description starts with `test`, `payment_declined` if order description starts with `xxx`, and a random pick between `payment_confirmed` & `payment_declined` if not matched.
7. **Order service** is subscribed to `payment_confirmed` & `payment_declined` event. Upon receiving either one of the event, it updates the order status to `confirmed` if `payment_confirmed`, `cancelled` if `payment_declined` and create events using `event-store`'s `createEvent` grpc method.
8. **Event-store** publishes `order_confirmed` if payment was confirmed, and `order_cancelled` if payment was declined.
9. **Order service** is subscribed to `order_confirmed` and update the corresponding order status to `delivered` upon receiving such event.
10. **Event-store** publishes `order_delivered` event.

### <a name="development"></a>Development

**Start docker services**

```shell
docker-compose up -d 
```

**Start applications**
From project root, open 4 terminals

**Terminal 1**:
```shell
cd order
npm run dev
```

**Terminal 2**:
```shell
cd event-store
npm run dev
```

**Terminal 3**:
```shell
cd payment
npm run dev
```


**Sample create order request**
```json
/POST localhost:3000, with the following body:
{
	"amount": 207.00,
	"description": "test top up e wallet"
}
```

**Sample create order response**
```json
{
	"id": "5e686586-5314-4f7d-bd0a-050cdca2d741"
}
```

**Sample get order status request**
```
/GET localhost:3000?id=5e686586-5314-4f7d-bd0a-050cdca2d741
```

**Sample get order status response**
```json
{
    "id": "5e686586-5314-4f7d-bd0a-050cdca2d741",
    "amount": "207.00",
    "user_id": "4391424b-6cc6-4f1d-a011-2f82ff293126",
    "payee_id": "8c638d8e-f788-4111-9b05-7b49617015af",
    "description": "test top up e wallet",
    "status": "delivered",
    "created_at": "2020-06-07T04:43:12.134Z",
    "updated_at": "2020-06-07T04:43:12.234Z"
}
```

### <a name="integration-test"></a>Integration Test

To run the integration test, ensure all the docker services have started and in proper order.

Then from project root, open 4 terminals (1-3 to start the services in development, and 4 to run the integeration test):

**Terminal 1**:
```shell
cd order
npm run dev
```

**Terminal 2**:
```shell
cd event-store
npm run dev
```

**Terminal 3**:
```shell
cd payment
npm run dev
```

**Terminal 4**
```shell
cd order
npm run test:integration
```

### <a name="kubernetes"></a>Kubernetes

This assumes that you have [helm](https://helm.sh/) installed.

From the project root:

```shell
helm install <release-name> helm-charts
```

To interact with the order api, the ip of the order service can be obtained via:
```shell
kubectl get svc/order
```
Sample output
```shell
NAME    TYPE        CLUSTER-IP     EXTERNAL-IP   PORT(S)    AGE
order   ClusterIP   10.43.219.72   <none>        3000/TCP   16s
```

Now can proceed to POST / GET to 10.43.219.72:3000 to create / get order.

To stop the stack:

```shell
helm uninstall <release-name>
```