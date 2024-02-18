const {
  Client,
  Collection,
  GatewayIntentBits,
  Partials,
} = require('discord.js')
const { Guilds, GuildMembers, GuildMessages, MessageContent } =
  GatewayIntentBits
const { User, Message, GuildMember, ThreadMember } = Partials
const { token } = require('./config')
const { loadEvents } = require('./handlers/events')

const client = new Client({
  intents: [Guilds, GuildMembers, GuildMessages, MessageContent],
  partials: [User, Message, GuildMember, ThreadMember],
})

client.events = new Collection()
client.commands = new Collection()
client.subCommands = new Collection()
client.cooldowns = new Collection()

loadEvents(client)

client.login(token)
