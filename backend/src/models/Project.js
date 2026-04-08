import mongoose from 'mongoose'

const projectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  tech_stack: {
    type: [String],
    default: []
  },
  github_url: {
    type: String,
    default: ''
  },
  image_url: {
    type: String,
    default: ''
  },
  contributors: {
    type: [String],
    default: []
  },
  featured: {
    type: Boolean,
    default: false
  }
}, { timestamps: true })

export default mongoose.model('Project', projectSchema)