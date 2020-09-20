const Blog = require('../models/blog')
const User = require('../models/user')

const initialBlogs = [
  {
    title: 'Title 1',
    author: 'Author 1',
    url: 'www.url.com/1',
    likes: 1,
  },
  {
    title: 'Title 2',
    author: 'Author 2',
    url: 'www.url.com/2',
    likes: 2,
  }
]

const nonExistingId = async () => {
  const blog = new Blog({ 
    title: 'Dummy',
    author: 'Dummy',
    url: 'Dummy',
    likes: 0,
  })
  await blog.save()
  await blog.remove()

  return blog._id.toString()
}

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

const usersInDb = async () => {
  const users = await User.find({})
  return users.map(u => u.toJSON())
}

module.exports = {
  initialBlogs, 
  nonExistingId, 
  blogsInDb,
  usersInDb,
}