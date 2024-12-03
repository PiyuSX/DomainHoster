import express from 'express'
import { sendEmail } from '../services/emailService.js'

const router = express.Router()

router.post('/', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body
    await sendEmail({ name, email, subject, message })
    res.json({ success: true, message: 'Email sent successfully' })
  } catch (error) {
    console.error('Contact form error:', error)
    res.status(500).json({ success: false, message: 'Failed to send email' })
  }
})

export { router as contactRouter }