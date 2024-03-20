const { Events } = require('discord.js')

module.exports = {
  name: Events.InteractionCreate,
  async execute(interaction, client) {
    if (!interaction.isButton()) return

    const button = client.buttons.get(interaction.customId)

    if (!button) return

    await button.execute(interaction, client)
  },
}
