const mongoose = require('mongoose')
const { mongoURI } = require('../config/db')

async function connectDB() {
  try {
    await mongoose.connect(mongoURI)
    console.log('[MONGODB] Connected.')
  } catch (err) {
    console.log(`[MONGODB] Error\n${err}`)
  }
}

module.exports = { connectDB }
