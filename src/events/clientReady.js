const { Events } = require('discord.js')
const { loadSlashCommands } = require('../handlers/slashCommandHandler')

module.exports = {
  name: Events.ClientReady,
  once: true,
  execute(client) {
    loadSlashCommands(client).then(() => {
      console.log(`Ready! Logged in as ${client.user.tag}`)
    })
  },
}
