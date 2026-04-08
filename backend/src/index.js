import './config.js'
import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import membersRouter from './routes/members.js'
import eventsRouter from './routes/events.js'
import announcementsRouter from './routes/announcements.js'
import adminAccessRouter from './routes/adminAccess.js'

const app = express()

app.use(cors({
  origin: 'https://kp-devcell.vercel.app',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json())

app.get('/', (req, res) => {
  res.json({ message: 'KP Dev Cell API is running' })
})

app.use('/api/members', membersRouter)
app.use('/api/events', eventsRouter)
app.use('/api/announcements', announcementsRouter)
app.use('/api/admin-access', adminAccessRouter)

mongoose.connect(process.env.MONGO_URI, {
  tls: true,
  tlsInsecure: true
})
  .then(() => {
    console.log('MongoDB connected')
  })
  .catch((err) => {
    console.log('MongoDB connection error:', err.message)
  })

app.listen(process.env.PORT || 5000, () => {
  console.log(`Server running on port ${process.env.PORT || 5000}`)
})