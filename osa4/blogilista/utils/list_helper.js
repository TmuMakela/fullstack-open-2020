const _ = require('lodash')

const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  const reducer = (sum, item) => {
    return sum + item
  }
  return blogs.length === 0
    ? 0 
    : blogs.map(blog => blog.likes).reduce(reducer, 0)
}

const favoriteBlog = (blogs) => {
  return blogs.length === 0 
    ? {}
    : _.pick(blogs.sort((a, b) => b.likes - a.likes)[0], ['title', 'author', 'likes'])
}

const mostBlogs = (blogs) => {
  return blogs.length === 0 
    ? {}
    : _(blogs)
      .groupBy('author')
      .map((group, key) => {
        return { author: key, blogs: group.length }
      })
      .value()
      .sort((a, b) => b.blogs - a.blogs)[0]
}

const mostLikes = (blogs) => {
  return blogs.length === 0 
  ? {}
  : _(blogs)
    .groupBy('author')
    .map((group, key) => {
      return { 
        author: key, 
        likes: group.map(o => o.likes).reduce((sum, n) => { return sum + n }, 0) 
      }
    })
    .value()
    .sort((a, b) => b.likes - a.likes)[0]
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}