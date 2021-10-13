const express = require('express')

module.exports = (service) => {
  const router = express.Router()

  router.post('/register', async (req, res, next) => {
    const { username, password } = req.body
    const token = await service.registerUser(username, password)
    if (token) {
      res.send({ token: token })
    } else {
      res.status(400).send(`Username ${username} already exists`)
    }
  })

  router.post('/login', async (req, res, next) => {
    const { username, password } = req.body
    const token = await service.loginUser(username, password)
    if (token) {
      res.send({ token: token })
    } else {
      res.status(400).send('Invalid login credentials')
    }
  })

  return router
}