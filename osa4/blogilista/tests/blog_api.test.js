const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)

const Blog = require('../models/blog')

beforeEach(async () => {
  await Blog.deleteMany({})
  await Blog.insertMany(helper.initialBlogs)
})

describe('get request', () => {
  test('correct number of blogs are returned', async () => {
    const response = await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)

    expect(response.body.length).toBe(helper.initialBlogs.length)
  })

  test('identification field name is id', async () => {
    const response = await api.get('/api/blogs')
    const idFieldMatch = response.body.every(blog => blog.hasOwnProperty('id'))
    expect(idFieldMatch).toBe(true)
  })
})

describe('post request', () => {
  test('new blog can be added', async () => {
    const newBlog = {
      title: 'New',
      url: 'New'
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)

    const newTitleMatch = blogsAtEnd.some(blog => blog.title === newBlog.title)
    expect(newTitleMatch).toBe(true)
  })

  test('set likes field to 0 if missing', async () => {
    const newBlog = {
      title: 'No likes set',
      url: 'No likes set'
    }

    const response = await api.post('/api/blogs').send(newBlog)
    expect(response.body.likes).toBe(0)
  })

  test('return status 400 if title or url is missing', async () => {
    const missingUrl = {
      title: 'url missing'
    }

    const missingTitle = {
      url: 'title missing'
    }

    const missingUrlAndTitle = {
      author: 'missing url and title'
    }

    await api.post('/api/blogs').send(missingUrl).expect(400)
    await api.post('/api/blogs').send(missingTitle).expect(400)
    await api.post('/api/blogs').send(missingUrlAndTitle).expect(400)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd.length).toBe(helper.initialBlogs.length)
  })
})

afterAll(() => {
  mongoose.connection.close()
})