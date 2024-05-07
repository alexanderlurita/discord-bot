const { PermissionFlagsBits, channelMention } = require('discord.js')
const { errorMessages } = require('../../../../constants/errorMessages')

module.exports = {
  subCommand: 'slowmode.unset',
  async execute(interaction) {
    const channel = interaction.options.getChannel('channel')

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

    await channel.setRateLimitPerUser(
      0,
      `Responsible: ${interaction.user.username} - (${interaction.user.id})`,
    )

    await interaction.reply(
      `El modo lento fue removido en el canal ${channelMention(channel.id)}.`,
    )
  },
}
