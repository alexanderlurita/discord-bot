const { ChannelType, EmbedBuilder, bold, time } = require('discord.js')
const { colors } = require('../constants/colors')

function getIconURL({ guild }) {
  return guild.iconURL({ dynamic: true, size: 2048 })?.replace('webp', 'png')
}

function getBannerURL({ guild }) {
  return guild.bannerURL({ dynamic: true, size: 2048 })?.replace('webp', 'png')
}

function buildGuildIconEmbed({ guild }) {
  const iconURL = getIconURL({ guild })

  const embed = new EmbedBuilder()
    .setColor(colors.warning)
    .setTitle(`Ícono de ${guild.name}`)
    .setImage(iconURL)

  return embed
}

function buildGuildBannerEmbed({ guild }) {
  const bannerURL = getBannerURL({ guild })

  const embed = new EmbedBuilder()
    .setColor(colors.warning)
    .setTitle(`Banner de fondo de ${guild.name}`)
    .setImage(bannerURL)

  return embed
}

async function buildGuildInfoEmbed({ guild, client }) {
  const iconURL = getIconURL({ guild })

  const formattedCreatedTimestamp = time(
    parseInt(guild.createdTimestamp / 1000),
    'f',
  )

  const channels = guild.channels.cache
  const channelTypesCount = {
    text: 0,
    voice: 0,
    thread: 0,
  }

  const channelTypeMap = {
    [ChannelType.GuildVoice]: 'voice',
    [ChannelType.GuildStageVoice]: 'voice',
    [ChannelType.PublicThread]: 'thread',
    [ChannelType.PrivateThread]: 'thread',
    [ChannelType.GuildText]: 'text',
    [ChannelType.GuildAnnouncement]: 'text',
    [ChannelType.GuildForum]: 'text',
  }

  channels.forEach((channel) => {
    const type = channelTypeMap[channel.type]
    if (type) {
      channelTypesCount[type]++
    }
  })

  const totalChannels = Object.values(channelTypesCount).reduce(
    (total, count) => total + count,
    0,
  )
  const { text, voice, thread } = channelTypesCount

  const verificationLevels = {
    1: 'Bajo',
    2: 'Medio',
    3: 'Alto',
    4: 'Extremo',
  }

  const embed = new EmbedBuilder()
    .setColor(colors.warning)
    .setAuthor({ name: guild.name })
    .setThumbnail(iconURL)
    .addFields(
      {
        name: 'ID Servidor',
        value: guild.id,
        inline: true,
      },
      {
        name: 'Dueño',
        value: (await guild.fetchOwner()).toString(),
        inline: true,
      },
      {
        name: 'Fecha creación',
        value: formattedCreatedTimestamp,
        inline: true,
      },
      {
        name: `Canales (${totalChannels})`,
        value: `${bold(text)} texto | ${bold(voice)} voz | ${bold(
          thread,
        )} hilo`,
        inline: true,
      },
      {
        name: 'Miembros',
        value: guild.memberCount.toString(),
        inline: true,
      },
      {
        name: 'Mejoras',
        value: guild.premiumSubscriptionCount.toString(),
        inline: true,
      },
      {
        name: 'Emojis',
        value: guild.emojis.cache.size.toString(),
        inline: true,
      },
      {
        name: 'Roles',
        value: String(guild.roles.cache.size - 1),
        inline: true,
      },
      {
        name: 'Verificación',
        value: verificationLevels[guild.verificationLevel],
        inline: true,
      },
    )
    .setFooter({
      text: client.user.username,
      iconURL: client.user.displayAvatarURL(),
    })

  return embed
}

module.exports = {
  getIconURL,
  getBannerURL,
  buildGuildIconEmbed,
  buildGuildBannerEmbed,
  buildGuildInfoEmbed,
}
