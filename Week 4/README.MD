# Fundamentals in Backend Development Week 4 Assignment

## Using the app

1. Install required packages.
```bash
npm install
```

2. Spin RabbitMQ docker image.
```bash
docker run --rm -it --hostname my-rabbit -p 15672:15672 -p 5672:5672 rabbitmq:3-management
```

3. Open RabbitMQ Management UI at http://localhost:15672/ to ensure that docker image is running successfully. Both username and password are usually `guest`.


4. Run the app through terminal and it will start to publish the heartbeat messages to RabbitMQ exchange and also in the terminal itself.
```bash
npm start
```

5. Connect to websocket endpoint at `/heartbeat` at [ws://localhost:3000/heartbeat](ws://localhost:3000/heartbeat)

6. Subscribe to the created RabbitMQ `hearbeat` exchange and also logs the messages to log.txt (append-mode).
    - *Remember that if you run this command again, it will overwrite the logs from previous run.*
```bash
node consumer.js > log.txt
```