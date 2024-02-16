const { Events } = require('discord.js')
const { developersId } = require('../config')

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

    if (command.developer && !developersId.includes(interaction.user.id)) {
      return interaction.reply({
        content: 'Este comando es solo para el developer.',
        ephemeral: true,
      })
    }

    const subCommand = interaction.options.getSubcommand(false)
    if (subCommand) {
      const subCommandFile = client.subCommands.get(
        `${interaction.commandName}.${subCommand}`,
      )

      if (!subCommandFile) {
        return interaction.reply({
          content: 'Este subcomando está desactualizado.',
          ephemeral: true,
        })
      }

      subCommandFile.execute(interaction, client)
    } else {
      command.execute(interaction, client)
    }
  },
}
