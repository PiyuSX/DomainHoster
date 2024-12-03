import express from 'express'

const router = express.Router()

// Simple authentication for demo purposes
// In production, use proper authentication with password hashing and JWT
router.post('/login', (req, res) => {
  const { username, password } = req.body
  
  // Hardcoded credentials for demo
  if (username === 'piyush' && password === 'piyush7788@') {
    res.json({ success: true, message: 'Authenticated successfully' })
  } else {
    res.status(401).json({ success: false, message: 'Invalid credentials' })
  }
})

export { router as authRouter }