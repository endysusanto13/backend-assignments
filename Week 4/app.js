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

heartbeatServer()

const PORT = 3000
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`)
})
