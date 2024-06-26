const {
  Client,
  Collection,
  GatewayIntentBits,
  Partials,
} = require('discord.js')
const { Guilds, GuildMembers, GuildMessages, MessageContent } =
  GatewayIntentBits
const { User, Message, GuildMember, ThreadMember } = Partials

const { TOKEN } = require('./config')

const { handleErrors } = require('./handlers/errors')
const { loadEvents } = require('./handlers/events')
const { loadButtons } = require('./handlers/buttons')
const { loadMenus } = require('./handlers/menus')

const { connectDB } = require('./database/db')

const client = new Client({
  intents: [Guilds, GuildMembers, GuildMessages, MessageContent],
  partials: [User, Message, GuildMember, ThreadMember],
})

const collectionNames = [
  'events',
  'commands',
  'subCommands',
  'cooldowns',
  'buttons',
  'menus',
  'snipes',
]

collectionNames.forEach((name) => {
  client[name] = new Collection()
})

handleErrors(client)
loadEvents(client)
loadButtons(client)
loadMenus(client)

client.login(TOKEN)

connectDB()
