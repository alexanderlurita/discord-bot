const { PermissionFlagsBits, bold, channelMention } = require('discord.js')
const ms = require('ms')
const hd = require('humanize-duration')

const { errorMessages } = require('../../../../constants/errorMessages')
const { hdOptions } = require('../../../../config/hd')

module.exports = {
  subCommand: 'slowmode.set',
  async execute(interaction) {
    const channel = interaction.options.getChannel('channel')
    const time = interaction.options.getString('time')

    if (
      !interaction.member.permissions.has(PermissionFlagsBits.ManageChannels)
    ) {
      return await interaction.reply({
        content: `${errorMessages.insufficientPermissions}\nRequiere: \`MANAGE_CHANNELS\``,
        ephemeral: true,
      })
    }

    if (
      !interaction.guild.members.me.permissions.has(
        PermissionFlagsBits.ManageChannels,
      )
    ) {
      return await interaction.reply({
        content: `${errorMessages.botInsufficientPermissions}\nRequiere: \`MANAGE_CHANNELS\``,
        ephemeral: true,
      })
    }

    const msTime = ms(time)

    if (isNaN(msTime)) {
      return await interaction.reply({
        content: 'Por favor escriba un tiempo válido.',
        ephemeral: true,
      })
    }

    if (msTime < 1000 || msTime > 21600000) {
      return await interaction.reply({
        content: 'El tiempo no puede ser menor a 1 segundo o mayor a 6 horas.',
        ephemeral: true,
      })
    }

    const formattedtime = hd(msTime, hdOptions)

    await channel.setRateLimitPerUser(
      msTime / 1000,
      `Responsible: ${interaction.user.username} - (${interaction.user.id})`,
    )

    await interaction.reply(
      `El modo lento fue establecido a ${bold(
        formattedtime,
      )} en el canal ${channelMention(channel.id)}.`,
    )
  },
}
