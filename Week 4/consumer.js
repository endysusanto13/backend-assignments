const amqp = require('amqplib/callback_api');

amqp.connect('amqp://localhost:5672', (error0, connection) => {
  if (error0) { throw error0 } 
  else { console.log('Connected to RabbitMQ') }
  
  connection.createChannel((error1, channel) => {
    if (error1) { throw error1 }
    else { console.log('Connected to channel') }

    const exchange = 'heartbeat'
    
    channel.assertExchange(exchange, 'fanout', {
      // Durability is not required for heartbeat messages
      durable: false
    })

    // Create a queue with a random name
    channel.assertQueue('', {
      // Automatically delete queue once it is disconnected
      exclusive: true
    }, (error2, q) => { if (error2) { throw error2 }
      console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", q.queue);
      channel.bindQueue(q.queue, exchange, '');
    
      channel.consume(q.queue, (msg) => {
        if(msg.content) {
            console.log(" [x] %s", msg.content.toString());
          }
      }, {
        noAck: true
      });
    });
  });
});


