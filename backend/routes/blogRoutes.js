import express from 'express'
import { BlogPost } from '../models/BlogPost.js'

const router = express.Router()

// Get all blog posts
router.get('/', async (req, res) => {
  try {
    const posts = await BlogPost.find().sort({ date: -1 })
    res.json(posts)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Get single blog post
router.get('/:id', async (req, res) => {
  try {
    const post = await BlogPost.findById(req.params.id)
    if (!post) return res.status(404).json({ message: 'Post not found' })
    res.json(post)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Create blog post
router.post('/', async (req, res) => {
  const post = new BlogPost(req.body)
  try {
    const newPost = await post.save()
    res.status(201).json(newPost)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
})

// Update blog post
router.put('/:id', async (req, res) => {
  try {
    const post = await BlogPost.findByIdAndUpdate(req.params.id, req.body, { new: true })
    if (!post) return res.status(404).json({ message: 'Post not found' })
    res.json(post)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
})

// Delete blog post
router.delete('/:id', async (req, res) => {
  try {
    const post = await BlogPost.findByIdAndDelete(req.params.id)
    if (!post) return res.status(404).json({ message: 'Post not found' })
    res.json({ message: 'Post deleted' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

export { router as blogRouter }