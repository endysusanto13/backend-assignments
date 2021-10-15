const express = require('express')
const logger = require('morgan')
const expressWs = require('express-ws')

const amqp = require('amqplib/callback_api');

const Heartbeat = require('./cron-heartbeat')
const heartbeatServer = Heartbeat(console)

const app = express()
app.use(logger('common'))


// -- Websocket Section --
expressWs(app)
const welcomeMsg = `
  Hi, you are connected. 
  I will be sending you heartbeat every minute and 42nd minute. 
  Please stay tune!
`
const replyMsg = 'Sorry, I am not designed to receive your message. But I can send you my heartbeat!'

app.ws('/heartbeat', (ws, req) => {
  setTimeout(() => {
    ws.send(welcomeMsg)
  }, 800)
  
  const heartbeatWs = Heartbeat(ws)
  heartbeatWs()
  
  ws.on('message', (msg) => {
    console.log(msg)
    setTimeout(() => {
      ws.send(replyMsg)
    }, 800)
  })
})

// -- AMQP Section --
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

    const heartbeatAmqp = Heartbeat(channel, exchange)
    heartbeatAmqp()
  });
});

heartbeatServer()

const PORT = 3000
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`)
})
