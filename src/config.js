require('dotenv').config({ path: ['.env.local', '.env'] })

const token = process.env.DISCORD_TOKEN

const devBotId = '1207676300567781446'
const prodBotId = '1059278935755604050'

const botId = process.env.NODE_ENV === 'development' ? devBotId : prodBotId

const devServerId = '1207739206382915594'
const developersId = ['507910496717111306']

module.exports = { botId, devServerId, developersId, token }
