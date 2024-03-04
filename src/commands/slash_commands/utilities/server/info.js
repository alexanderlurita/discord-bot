const { ChannelType, EmbedBuilder } = require('discord.js')
const { colors } = require('../../../../constants/colors')
const { formatTimestamps } = require('../../../../utils/formatTimestamp')

module.exports = {
  subCommand: 'server.info',
  async execute(interaction, client) {
    const guild = interaction.guild

    const icon = guild.iconURL({ dynamic: true })?.replace('webp', 'png')

    const { formattedDate } = formatTimestamps(guild.createdTimestamp)

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

    const embedData = {
      color: colors.warning,
      author: { name: interaction.guild.name },
      thumbnail: icon,
      fields: [
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
          value: formattedDate,
          inline: true,
        },
        {
          name: `Canales (${totalChannels})`,
          value: `**${text}** texto | **${voice}** voz | **${thread}** hilo`,
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
      ],
      footer: {
        text: client.user.username,
        iconURL: client.user.avatarURL(),
      },
    }

    const embedBuilder = new EmbedBuilder()
      .setColor(embedData.color)
      .setAuthor(embedData.author)
      .setThumbnail(embedData.thumbnail)
      .addFields(embedData.fields)
      .setFooter(embedData.footer)

    await interaction.reply({ embeds: [embedBuilder] })
  },
}
