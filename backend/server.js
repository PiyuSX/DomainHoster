import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import dotenv from 'dotenv'
import { blogRouter } from './routes/blogRoutes.js'
import { portfolioRouter } from './routes/portfolioRoutes.js'
import { authRouter } from './routes/authRoutes.js'
import { contactRouter } from './routes/contactRoutes.js'

dotenv.config()

const app = express()

// Middleware
app.use(cors())
app.use(express.json())

// MongoDB connection with enhanced error handling and options
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
  socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
})
.then(() => {
  console.log('Successfully connected to MongoDB.')
})
.catch((err) => {
  console.error('MongoDB connection error:', err)
  process.exit(1) // Exit process with failure
})

// Connection error handling
mongoose.connection.on('error', err => {
  console.error('MongoDB connection error:', err)
})

mongoose.connection.on('disconnected', () => {
  console.warn('MongoDB disconnected. Attempting to reconnect...')
})

mongoose.connection.on('reconnected', () => {
  console.log('MongoDB reconnected')
})

// Routes
app.use('/api/blog', blogRouter)
app.use('/api/portfolio', portfolioRouter)
app.use('/api/auth', authRouter)
app.use('/api/contact', contactRouter)

// Basic error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({ 
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  })
})

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

// Handle process termination
process.on('SIGINT', async () => {
  try {
    await mongoose.connection.close()
    console.log('MongoDB connection closed through app termination')
    process.exit(0)
  } catch (err) {
    console.error('Error during MongoDB disconnect:', err)
    process.exit(1)
  }
})