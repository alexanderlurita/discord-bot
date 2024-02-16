const { EmbedBuilder } = require('discord.js')
const { colors } = require('../../../../constants/colors')
const { formatTimestamps } = require('../../../../utils/formatTimestamp')

module.exports = {
  subCommand: 'user.info',
  async execute(interaction, client) {
    const member = interaction.options.getMember('user') || interaction.member

    const avatar = member.user
      .displayAvatarURL({ dynamic: true, size: 2048 })
      .replace('webp', 'png')

    const roles = member.roles.cache
      .sort((a, b) => b.position - a.position)
      .map((role) => role.toString())
      .slice(0, -1)
    const displayRoles = roles.join(', ') || 'Sin roles'

    const hexColor =
      member.displayHexColor !== '#000000'
        ? member.displayHexColor
        : colors.default

    const formattedCreatedTimestamp = formatTimestamps(
      member.user.createdTimestamp,
    )
    const formattedJoinedTimestamp = formatTimestamps(member.joinedTimestamp)

    const embedData = {
      color: hexColor,
      title: `${member.guild.ownerId === member.id ? '👑' : ''} ${
        member.user.globalName || member.user.username
      }`,
      titleURL: `https://discord.com/users/${member.id}`,
      thumbnail: avatar,
      fields: [
        {
          name: 'Información del Usuario',
          value:
            `**ID:** ${member.id}\n` +
            `**Usuario:** ${member.user.username}\n` +
            `**Nombre**: ${member.user.globalName || 'No tiene'}\n` +
            `**Nick:** ${member.nickname || 'No tiene'}\n` +
            `**Color:** ${hexColor.toUpperCase()}\n` +
            `**Bot:** ${member.user.bot ? 'Si' : 'No'}`,
        },
        {
          name: 'Membresía en Discord',
          value: `${formattedCreatedTimestamp.formattedDate} (${formattedCreatedTimestamp.relativeTime})`,
        },
        {
          name: `Membresía en ${member.guild.name}`,
          value: `${formattedJoinedTimestamp.formattedDate} (${formattedJoinedTimestamp.relativeTime})`,
        },
        {
          name: 'Roles',
          value: `${displayRoles}`,
        },
      ],
      footer: {
        text: client.user.username,
        iconURL: client.user.displayAvatarURL(),
      },
    }

    const embedBuilder = new EmbedBuilder()
      .setColor(embedData.color)
      .setTitle(embedData.title)
      .setURL(embedData.titleURL)
      .setThumbnail(embedData.thumbnail)
      .addFields(...embedData.fields)
      .setFooter(embedData.footer)

    await interaction.reply({ embeds: [embedBuilder] })
  },
}
