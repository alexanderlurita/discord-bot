const { Events } = require('discord.js')
const hd = require('humanize-duration')
const { hdOptions } = require('../config/hd')
const { DEVELOPERS_ID } = require('../config')
const { trackCooldowns } = require('../handlers/cooldowns')

module.exports = {
  name: Events.InteractionCreate,
  async execute(interaction, client) {
    if (!interaction.isChatInputCommand()) return

    const commandName = interaction.commandName
    const command = client.commands.get(commandName)

    if (!command) {
      return interaction.reply({
        content: 'Este comando está desactualizado.',
        ephemeral: true,
      })
    }

    if (command.developer && !DEVELOPERS_ID.includes(interaction.user.id)) {
      return interaction.reply({
        content: 'Este comando es solo para developers.',
        ephemeral: true,
      })
    }

    const subCommandName = interaction.options.getSubcommand(false)
    const subCommand = subCommandName
      ? client.subCommands.get(`${commandName}.${subCommandName}`)
      : null

    if (subCommandName && !subCommand) {
      return interaction.reply({
        content: 'Este subcomando está desactualizado.',
        ephemeral: true,
      })
    }

    const { onCooldown, remainingTime } = trackCooldowns({
      interaction,
      commandCategory: subCommand ? 'subCommand' : 'command',
      commandData: subCommand || command,
    })

    if (onCooldown) {
      const replyMessage = `No puedes usar el comando \`${
        subCommandName ? `${commandName} ${subCommandName}` : commandName
      }\`. Puedes usarlo nuevamente ${hd(remainingTime, hdOptions)}.`

      return interaction.reply({
        content: replyMessage,
        ephemeral: true,
      })
    }

    subCommand
      ? await subCommand.execute(interaction, client)
      : await command.execute(interaction, client)
  },
}
