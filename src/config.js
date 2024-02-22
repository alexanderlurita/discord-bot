require('dotenv').config({ path: ['.env.local', '.env'] })

const TOKEN = process.env.DISCORD_TOKEN

const DEV_BOT_ID = '1207676300567781446'
const PROD_BOT_ID = '1059278935755604050'

const BOT_ID = process.env.NODE_ENV === 'development' ? DEV_BOT_ID : PROD_BOT_ID

const DEV_SERVER_ID = '1207739206382915594'
const DEVELOPERS_ID = ['507910496717111306']

const DISCORD_API_URL = 'https://discord.com/api'

module.exports = {
  BOT_ID,
  DEV_SERVER_ID,
  DEVELOPERS_ID,
  TOKEN,
  DISCORD_API_URL,
}
