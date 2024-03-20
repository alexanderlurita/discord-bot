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

const { loadEvents } = require('./handlers/events')
const { loadButtons } = require('./handlers/buttons')
const { loadMenus } = require('./handlers/menus')

const { connectDB } = require('./database/db')

const client = new Client({
  intents: [Guilds, GuildMembers, GuildMessages, MessageContent],
  partials: [User, Message, GuildMember, ThreadMember],
})

client.events = new Collection()
client.commands = new Collection()
client.subCommands = new Collection()
client.cooldowns = new Collection()
client.buttons = new Collection()
client.menus = new Collection()

loadEvents(client)
loadButtons(client)
loadMenus(client)

client.login(TOKEN)

connectDB()
