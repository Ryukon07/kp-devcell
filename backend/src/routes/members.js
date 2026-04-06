import express from 'express'
import Member from '../models/Member.js'
import verifyToken from '../middleware/auth.js'

const router = express.Router()

// GET all members — public
router.get('/', async (req, res) => {
  try {
    const members = await Member.find()
    res.json(members)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// GET single member — public
router.get('/:id', async (req, res) => {
  try {
    const member = await Member.findById(req.params.id)
    if (!member) return res.status(404).json({ message: 'Member not found' })
    res.json(member)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// POST create member — admin only
router.post('/', verifyToken, async (req, res) => {
  try {
    const member = new Member(req.body)
    const saved = await member.save()
    res.status(201).json(saved)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

// PUT update member — admin only
router.put('/:id', verifyToken, async (req, res) => {
  try {
    const updated = await Member.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    )
    res.json(updated)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

// DELETE member — admin only
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    await Member.findByIdAndDelete(req.params.id)
    res.json({ message: 'Member deleted' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

export default router