import express from 'express'
import { PortfolioItem } from '../models/PortfolioItem.js'

const router = express.Router()

// Get all portfolio items
router.get('/', async (req, res) => {
  try {
    const items = await PortfolioItem.find()
    res.json(items)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Get single portfolio item
router.get('/:id', async (req, res) => {
  try {
    const item = await PortfolioItem.findById(req.params.id)
    if (!item) return res.status(404).json({ message: 'Item not found' })
    res.json(item)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Create portfolio item
router.post('/', async (req, res) => {
  const item = new PortfolioItem(req.body)
  try {
    const newItem = await item.save()
    res.status(201).json(newItem)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
})

// Update portfolio item
router.put('/:id', async (req, res) => {
  try {
    const item = await PortfolioItem.findByIdAndUpdate(req.params.id, req.body, { new: true })
    if (!item) return res.status(404).json({ message: 'Item not found' })
    res.json(item)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
})

// Delete portfolio item
router.delete('/:id', async (req, res) => {
  try {
    const item = await PortfolioItem.findByIdAndDelete(req.params.id)
    if (!item) return res.status(404).json({ message: 'Item not found' })
    res.json({ message: 'Item deleted' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

export { router as portfolioRouter }