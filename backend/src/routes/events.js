import express from 'express'
import Event from '../models/Event.js'
import verifyToken from '../middleware/auth.js'

const router = express.Router()

// GET all events
router.get('/', async (req, res) => {
  try {
    const events = await Event.find().sort({ date: -1 })
    res.json(events)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// GET upcoming events only
router.get('/upcoming', async (req, res) => {
  try {
    const events = await Event.find({ type: 'upcoming' }).sort({ date: 1 })
    res.json(events)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// POST create event (admin only)
router.post('/', verifyToken, async (req, res) => {
  try {
    const event = new Event(req.body)
    const saved = await event.save()
    res.status(201).json(saved)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

// PUT update event (admin only)
router.put('/:id', verifyToken, async (req, res) => {
  try {
    const updated = await Event.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    )
    res.json(updated)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

// DELETE event (admin only)
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    await Event.findByIdAndDelete(req.params.id)
    res.json({ message: 'Event deleted' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

export default router