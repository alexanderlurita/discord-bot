const { Events } = require('discord.js')

module.exports = {
  name: Events.InteractionCreate,
  async execute(interaction, client) {
    if (!interaction.isAutocomplete()) return

    const commandName = interaction.commandName
    const command = client.commands.get(commandName)

    if (!command) return

    const subCommandGroupName = interaction.options.getSubcommandGroup(false)
    const subCommandName = interaction.options.getSubcommand(false)

    const subCommandKey = subCommandGroupName
      ? `${commandName}.${subCommandGroupName}.${subCommandName}`
      : subCommandName
      ? `${commandName}.${subCommandName}`
      : null

    const subCommand = subCommandKey
      ? client.subCommands.get(subCommandKey)
      : null

    if (subCommandName && !subCommand) return

    try {
      subCommand
        ? await subCommand.autocomplete(interaction)
        : await command.autocomplete(interaction)
    } catch (err) {
      console.error(err)
    }
  },
}
