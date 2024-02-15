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
const { loadEvents } = require('./handlers/eventHandler')

const client = new Client({
  intents: [Guilds, GuildMembers, GuildMessages, MessageContent],
  partials: [User, Message, GuildMember, ThreadMember],
})

client.events = new Collection()
client.commands = new Collection()

loadEvents(client)

client.login(token)
