const jwt = require('jsonwebtoken')
const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')

blogsRouter.get('/', async (request, response) => {
  const select = { username: 1, name: 1 }
  const blogs = await Blog.find({}).populate('user', select)
  response.json(blogs)
})

blogsRouter.post('/', async (request, response) => {
  const body = request.body

  const decodedToken = jwt.verify(request.token, process.env.SECRET)
  if (!decodedToken || !decodedToken.id) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }  
  const user = await User.findById(decodedToken.id)

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
    user: user._id
  })

  if (!blog.title) {
    return response.status(400).json({ error: 'title missing' })
  } else if (!blog.url) {
    return response.status(400).json({ error: 'url missing' })
  }

  if (!blog.likes) {
    blog.likes = 0
  }

  const savedBlog = await blog.save()
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()
  response.status(201).json(savedBlog)
})

blogsRouter.put('/:id', async (request, response) => {
  const update = { 
    title: request.body.title,
    author: request.body.author,
    url: request.body.url,
    likes: request.body.likes 
  }
  const options = { new: true }
  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, update, options)
  response.json(updatedBlog.toJSON())
})

blogsRouter.delete('/:id', async (request, response) => {
  const decodedToken = jwt.verify(request.token, process.env.SECRET)
  if (!decodedToken || !decodedToken.id) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }  

  const user = (await User.findById(decodedToken.id)).toJSON()
  const blog = (await Blog.findById(request.params.id)).toJSON()

  if (user.id.toString() === blog.user.toString()) {
    await Blog.findByIdAndRemove(request.params.id)
    response.status(204).end()
  }
  return response.status(401).json({ error: 'blog does not belong to user' })
})

module.exports = blogsRouter