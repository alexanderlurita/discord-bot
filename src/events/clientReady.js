const { Events } = require('discord.js')
const { loadSlashCommands } = require('../handlers/slashCommands')
const { updatePresence } = require('../utils/updatePresence')

module.exports = {
  name: Events.ClientReady,
  once: true,
  execute(client) {
    updatePresence(client)

    loadSlashCommands(client).then(() => {
      console.log(`Ready! Logged in as ${client.user.tag}`)
    })
  },
}
