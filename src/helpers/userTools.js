const { EmbedBuilder, bold, roleMention, time } = require('discord.js')
const { colors } = require('../constants/colors')
const { formats } = require('../constants')

function getAvatarURL({ user, format = 'png' }) {
  if (!formats.includes(format)) {
    format = 'webp'
  }

  return user
    .displayAvatarURL({ dynamic: true, size: 2048 })
    .replace('webp', format)
}

function getBannerURL({ user, format = 'png' }) {
  if (!formats.includes(format)) {
    format = 'webp'
  }

  return user.bannerURL({ dynamic: true, size: 2048 })?.replace('webp', format)
}

function buildUserAvatarEmbed({ user }) {
  const avatarURL = getAvatarURL({ user })

  const embed = new EmbedBuilder()
    .setColor(colors.warning)
    .setTitle(`Avatar de ${user.globalName ?? user.username}`)
    .setImage(avatarURL)
    .addFields({
      name: 'Formatos',
      value: `[PNG](${avatarURL}) | [JPG](${avatarURL.replace(
        'png',
        'jpg',
      )}) | [WEBP](${avatarURL.replace('png', 'webp')})`,
    })
    .setFooter({ text: 'Detrás de cada avatar, hay un mundo por descubrir.' })

  return embed
}

function buildUserBannerEmbed({ user }) {
  const bannerURL = getBannerURL({ user })

  const embed = new EmbedBuilder()
    .setColor(colors.warning)
    .setTitle(`Banner de ${user.globalName ?? user.username}`)
    .setImage(bannerURL)
    .addFields({
      name: 'Formatos',
      value: `[PNG](${bannerURL}) | [JPG](${bannerURL.replace(
        'png',
        'jpg',
      )}) | [WEBP](${bannerURL.replace('png', 'webp')})`,
    })
    .setFooter({ text: 'Un banner puede cambiar la perspectiva de un mundo.' })

  return embed
}

function buildUserInfoEmbed({ member, client }) {
  const avatarURL = getAvatarURL({ user: member.user })

  const roles = member.roles.cache
    .sort((a, b) => b.position - a.position)
    .map((role) => roleMention(role.id))
    .slice(0, -1)
  const displayRoles = roles.join(', ') || 'Sin roles'

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
    .setThumbnail(avatarURL)
    .addFields(
      {
        name: 'Usuario',
        value:
          `${bold('ID:')} ${member.id}\n` +
          `${bold('Nombre:')} ${
            member.user.globalName
              ? `${member.user.globalName} (${member.user.username})`
              : member.user.username
          }\n` +
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

module.exports = {
  getAvatarURL,
  getBannerURL,
  buildUserAvatarEmbed,
  buildUserBannerEmbed,
  buildUserInfoEmbed,
}
