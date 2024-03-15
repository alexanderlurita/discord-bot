const { Events } = require('discord.js')
const hd = require('humanize-duration')

const { hdOptions } = require('../../config/hd')
const { DEVELOPERS_ID } = require('../../config')
const { trackCooldowns } = require('../../handlers/cooldowns')

module.exports = {
  name: Events.InteractionCreate,
  async execute(interaction, client) {
    if (!interaction.isChatInputCommand()) return

    const commandName = interaction.commandName
    const command = client.commands.get(commandName)

    if (!command) {
      return await interaction.reply({
        content: 'Este comando está desactualizado.',
        ephemeral: true,
      })
    }

    if (command.developer && !DEVELOPERS_ID.includes(interaction.user.id)) {
      return await interaction.reply({
        content: 'Este comando es solo para developers.',
        ephemeral: true,
      })
    }

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

    if (subCommandName && !subCommand) {
      return await interaction.reply({
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
        subCommandGroupName
          ? `${commandName} ${subCommandGroupName} ${subCommandName}`
          : subCommandName
          ? `${commandName} ${subCommandName}`
          : commandName
      }\`. Puedes usarlo nuevamente ${hd(remainingTime, hdOptions)}.`

      return await interaction.reply({
        content: replyMessage,
        ephemeral: true,
      })
    }

    subCommand
      ? await subCommand.execute(interaction, client)
      : await command.execute(interaction, client)
  },
}
