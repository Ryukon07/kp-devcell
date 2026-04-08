import express from 'express'
import Post from '../models/Post.js'
import verifyToken from '../middleware/auth.js'

const router = express.Router()

// GET all posts
router.get('/', async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 })
    res.json(posts)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// GET single post
router.get('/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
    if (!post) return res.status(404).json({ message: 'Post not found' })
    res.json(post)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// POST create post (admin only)
router.post('/', verifyToken, async (req, res) => {
  try {
    const post = new Post(req.body)
    const saved = await post.save()
    res.status(201).json(saved)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

// PUT update post (admin only)
router.put('/:id', verifyToken, async (req, res) => {
  try {
    const updated = await Post.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    )
    res.json(updated)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

// DELETE post (admin only)
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    await Post.findByIdAndDelete(req.params.id)
    res.json({ message: 'Post deleted' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

export default router