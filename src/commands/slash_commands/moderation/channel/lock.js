const { EmbedBuilder, PermissionFlagsBits } = require('discord.js')
const { errorMessages } = require('../../../../constants/errorMessages')
const { colors } = require('../../../../constants/colors')

module.exports = {
  subCommand: 'channel.lock',
  async execute(interaction) {
    const { channel, guild, member } = interaction

    if (!member.permissions.has(PermissionFlagsBits.ManageChannels)) {
      return await interaction.reply({
        content: `${errorMessages.insufficientPermissions}\nRequiere: \`MANAGE_CHANNELS\``,
        ephemeral: true,
      })
    }

    if (!guild.members.me.permissions.has(PermissionFlagsBits.ManageChannels)) {
      return await interaction.reply({
        content: `${errorMessages.botInsufficientPermissions}\nRequiere: \`MANAGE_CHANNELS\``,
        ephemeral: true,
      })
    }

    await channel.permissionOverwrites.edit(guild.id, { SendMessages: false })

    const embed = new EmbedBuilder()
      .setColor(colors.warning)
      .setTitle('Canal bloqueado 🔒')
      .setTimestamp()
      .setFooter({ text: guild.name, iconURL: guild.iconURL() })

    await interaction.reply({ embeds: [embed] })
  },
}
