const { Events } = require('discord.js')

module.exports = {
  name: Events.InteractionCreate,

  async execute(interaction, client) {
    if (!interaction.isChatInputCommand()) return

    const command = client.commands.get(interaction.commandName)

    if (!command) {
      return interaction.reply({
        content: 'Este comando está desactualizado.',
        ephemeral: true,
      })
    }

    if (command.developer && interaction.user.id !== '507910496717111306') {
      return interaction.reply({
        content: 'Este comando es solo para el developer.',
        ephemeral: true,
      })
    }

    command.execute(interaction, client)
  },
}
