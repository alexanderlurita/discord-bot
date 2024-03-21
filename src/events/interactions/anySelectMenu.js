const { Events } = require('discord.js')

module.exports = {
  name: Events.InteractionCreate,
  async execute(interaction, client) {
    if (!interaction.isAnySelectMenu()) return

    const menu = client.menus.get(interaction.customId)

    if (!menu) return

    await menu.execute(interaction, client)
  },
}
