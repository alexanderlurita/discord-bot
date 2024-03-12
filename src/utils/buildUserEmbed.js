const { EmbedBuilder, bold, time, roleMention } = require('discord.js')
const { colors } = require('../constants/colors')

function buildUserEmbed({ member, client }) {
  const avatar = member.user
    .displayAvatarURL({ dynamic: true, size: 2048 })
    .replace('webp', 'png')

  const roles = member.roles.cache
    .sort((a, b) => b.position - a.position)
    .map((role) => roleMention(role.id))
    .slice(0, -1)
  const displayRoles = roles.join(', ') ?? 'Sin roles'

  const hexColor =
    member.displayHexColor !== '#000000'
      ? member.displayHexColor
      : colors.default

  const formattedCreatedTimestamp = [
    time(parseInt(member.user.createdTimestamp / 1000), 'f'),
    time(parseInt(member.user.createdTimestamp / 1000), 'R'),
  ]
  const formattedJoinedTimestamp = [
    time(parseInt(member.joinedTimestamp / 1000), 'f'),
    time(parseInt(member.joinedTimestamp / 1000), 'R'),
  ]

  const embed = new EmbedBuilder()
    .setColor(hexColor)
    .setTitle(
      `${member.guild.ownerId === member.id ? '👑' : ''} ${
        member.user.globalName ?? member.user.username
      }`,
    )
    .setURL(`https://discord.com/users/${member.id}`)
    .setThumbnail(avatar)
    .addFields(
      {
        name: 'Información del Usuario',
        value:
          `${bold('ID:')} ${member.id}\n` +
          `${bold('Usuario:')} ${member.user.username}\n` +
          `${bold('Nombre:')} ${member.user.globalName ?? 'No tiene'}\n` +
          `${bold('Nick:')} ${member.nickname ?? 'No tiene'}\n` +
          `${bold('Color:')} ${hexColor.toUpperCase()}\n` +
          `${bold('Bot:')} ${member.user.bot ? 'Si' : 'No'}`,
      },
      {
        name: 'Membresía en Discord',
        value: `${formattedCreatedTimestamp[0]} (${formattedCreatedTimestamp[1]})`,
      },
      {
        name: `Membresía en ${member.guild.name}`,
        value: `${formattedJoinedTimestamp[0]} (${formattedJoinedTimestamp[1]})`,
      },
      {
        name: 'Roles',
        value: `${displayRoles}`,
      },
    )
    .setFooter({
      text: client.user.username,
      iconURL: client.user.displayAvatarURL(),
    })

  return embed
}

module.exports = { buildUserEmbed }
