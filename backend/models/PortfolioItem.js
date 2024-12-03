import mongoose from 'mongoose'

const portfolioItemSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  link: {
    type: String,
    required: true
  },
  github: {
    type: String
  }
})

export const PortfolioItem = mongoose.model('PortfolioItem', portfolioItemSchema)