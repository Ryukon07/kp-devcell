import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import dotenv from 'dotenv'
import membersRouter from './routes/members.js'
import projectsRouter from './routes/projects.js'
import eventsRouter from './routes/events.js'
import postsRouter from './routes/posts.js'

dotenv.config()

const app = express()

app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
  res.json({ message: 'KP Dev Cell API is running' })
})

app.use('/api/members', membersRouter)
app.use('/api/projects', projectsRouter)
app.use('/api/events', eventsRouter)
app.use('/api/posts', postsRouter)

mongoose.connect(process.env.MONGO_URI, {
    tls : true,
    tlsInsecure : true
})
  .then(() => {
    console.log('MongoDB connected')
    app.listen(process.env.PORT, () => {
      console.log(`Server running on port ${process.env.PORT}`)
    })
  })
  .catch((err) => {
    console.log('MongoDB connection error:', err)
  })