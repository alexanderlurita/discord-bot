require('dotenv').config({ path: ['.env.local', '.env'] })

const TOKEN = process.env.DISCORD_TOKEN
const WEBHOOK_URL = process.env.DISCORD_WEBHOOK_URL

const DEV_SERVER_ID = '1207739206382915594'
const DEVELOPERS_ID = ['507910496717111306']

module.exports = { DEV_SERVER_ID, DEVELOPERS_ID, TOKEN, WEBHOOK_URL }
