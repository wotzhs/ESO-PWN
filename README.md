# ESO-PWN

Event Sourcing Order-Payment with NATS

## Getting Started

### Development

**IMPORTANT**: Due to the docker nats-streaming image not having a shell, it is not possible to wait for the db connection before start itself. Hence the docker services have to be started exactly in the following order:

```shell
docker-compose up -d order-db event-store-db nats-streaming-db 
docker-compose up -d nats-streaming
```
