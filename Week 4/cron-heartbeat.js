const cron = require('node-cron')

module.exports = (module, exchange) => {
  const heartbeat1MinMsg = 'I\'m alive at '
  const heartbeat42MinMsg = '42 is the meaning to life!'

  return () => {
    cron.schedule('*/1 * * * *', () => {
      let msg = heartbeat1MinMsg + new Date()
      // Use ws.send() method if websocket is injected
      if (module.send) { module.send(msg) } 
      // Use channel.publish() method if amqp channel is injected
      else if (exchange && module.publish) { module.publish(exchange, '', Buffer.from(msg)) } 
      // Print on server if console is injected
      else if (module.log) { module.log(msg) } 
      // If nothin is injected
      else { console.log("Server fails to send heartbeat every minute.") }
    })

    // Similar to the cron.schedule above
    cron.schedule('42 * * * *', () => {
      let msg = heartbeat42MinMsg
      if (module.send) { module.send(msg) } 
      else if (exchange && module.publish) { module.publish(exchange, '', Buffer.from(msg)) } 
      else if (module.log) { module.log(msg) }
      else { console.log("Server fails to send heartbeat on the 42nd minute.") }
    })
  }
}