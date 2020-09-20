const bcrypt = require('bcryptjs')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.get('/', async (request, response) => {
  const users = await User.find({}).populate('blogs')
  response.json(users)
})

usersRouter.post('/', async (request, response) => {
  const body = request.body

  if (!body.username) {
    return response.status(400).json({ error: 'username missing' })
  } else if (!body.password) {
    return response.status(400).json({ error: 'password missing' })
  } else if (body.password.length < 3) {
    return response.status(400).json({ error: 'password too short, minimum length is three characters' })
  }

  const salt = bcrypt.genSaltSync(10)
  const passwordHash = bcrypt.hashSync(body.password, salt)

  const user = new User({
    username: body.username,
    name: body.name,
    passwordHash,
  })

  const savedUser = await user.save()
  response.json(savedUser)
})

module.exports = usersRouter