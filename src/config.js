const dotenv = require('dotenv')

dotenv.config()

const token = process.env.DISCORD_TOKEN

module.exports = { token }
