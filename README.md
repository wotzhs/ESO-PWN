# ESO-PWN

Event Sourcing Order-Payment with NATS

## Getting Started

### Application Overview
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
### Development

**IMPORTANT**: Due to the docker nats-streaming image not having a shell, it is not possible to wait for the db connection before start itself. Hence the docker services have to be started exactly in the following order:

```shell
docker-compose up -d order-db event-store-db nats-streaming-db 
docker-compose up -d nats-streaming
```

**Sample create order request**
```
POST to localhost:3000

{
	"amount": 207.00,
	"description": "test top up e wallet"
}
```

**Sample create order response**
```
{
	"id": "5e686586-5314-4f7d-bd0a-050cdca2d741"
}
```

**Sample get order status request**
```
GET to localhost:3000?id=5e686586-5314-4f7d-bd0a-050cdca2d741
```

**Sample get order status response**
```
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

### Integration Test

To run the integration test, ensure all the docker services have started and in proper order.

Then from project root:
```
cd order
npm run test:integration
```