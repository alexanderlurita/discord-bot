require('dotenv').config({ path: ['.env.local', '.env'] })

const token = process.env.DISCORD_TOKEN

module.exports = { token }
