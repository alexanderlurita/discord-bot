const {
  ChannelType,
  Colors,
  EmbedBuilder,
  PermissionFlagsBits,
  SlashCommandBuilder,
  channelMention,
} = require('discord.js')

const {
  saveCounterChannel,
  deleteChannelById,
  getCounterChannels,
} = require('../../../controllers/counter')
const { errorMessages } = require('../../../constants/errorMessages')

async function enableCounter({ guildId, channel, interaction }) {
  try {
    const savedCounter = await saveCounterChannel({
      guildId,
      channelId: channel.id,
    })

    if (savedCounter) {
      const embed = new EmbedBuilder()
        .setColor(Colors.Green)
        .setAuthor({
          name: interaction.user.username,
          iconURL: interaction.user.displayAvatarURL(),
        })
        .setDescription(
          `Se ha habilitado el conteo en ${channelMention(
            channel.id,
          )}.\nEnvíe el número ${await getNextNumber(
            channel,
          )} allí para comenzar.`,
        )

      await interaction.reply({ embeds: [embed] })
    }
  } catch {
    await interaction.reply(
      'Ocurrió un problema al intentar habilitar el contador.',
    )
  }
}

async function disableCounter({ guildId, channel, interaction }) {
  try {
    await deleteChannelById({ guildId, channelId: channel.id })

    const embed = new EmbedBuilder()
      .setColor(Colors.Green)
      .setAuthor({
        name: interaction.user.username,
        iconURL: interaction.user.displayAvatarURL(),
      })
      .setDescription(`Conteo deshabilitado en ${channelMention(channel.id)}.`)

    await interaction.reply({ embeds: [embed] })
  } catch {
    await interaction.reply(
      'Ocurrió un problema al intentar deshabilitar el contador.',
    )
  }
}

async function infoCounter({ guildId, channel, interaction }) {
  try {
    const counterChannels = await getCounterChannels({ guildId })

    const embed = new EmbedBuilder()

    if (!counterChannels || !counterChannels.channelIds.includes(channel.id)) {
      embed
        .setColor(Colors.Red)
        .setAuthor({
          name: interaction.user.username,
          iconURL: interaction.user.displayAvatarURL(),
        })
        .setDescription(
          `El conteo no está habilitado para ${channelMention(channel.id)}.`,
        )

      return await interaction.reply({ embeds: [embed] })
    }

    embed.setColor(Colors.Green).addFields(
      {
        name: 'Channel',
        value: channelMention(channel.id),
        inline: true,
      },
      {
        name: 'Next number',
        value: String(await getNextNumber(channel)),
        inline: true,
      },
    )

    await interaction.reply({ embeds: [embed] })
  } catch {
    await interaction.reply(
      'Ocurrió un problema al intentar obtener información sobre el contador.',
    )
  }
}

async function getNextNumber(channel) {
  const messages = await channel.messages.fetch({ limit: 1 })
  const lastMessage = messages.first()

  if (!lastMessage || isNaN(parseInt(lastMessage.content))) {
    return 1
  } else {
    return parseInt(lastMessage.content) + 1
  }
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName('counting')
    .setDescription('Manage the counter in a specific channel')
    .setDMPermission(false)
    .addStringOption((option) =>
      option
        .setName('action')
        .setDescription('Select an action for the counter')
        .addChoices(
          { name: 'Enable counter', value: 'enable' },
          { name: 'Disable counter', value: 'disable' },
          { name: 'Get information', value: 'info' },
        )
        .setRequired(true),
    )
    .addChannelOption((option) =>
      option
        .setName('channel')
        .setDescription('Select the channel where the action will be performed')
        .addChannelTypes(ChannelType.GuildText)
        .setRequired(true),
    ),

  async execute(interaction, client) {
    const action = interaction.options.getString('action')
    const channel = interaction.options.getChannel('channel')

    if (
      !interaction.member.permissions.has(PermissionFlagsBits.ManageChannels)
    ) {
      return await interaction.reply({
        content: `${errorMessages.insufficientPermissions}\nRequiere: \`MANAGE_CHANNELS\``,
        ephemeral: true,
      })
    }

    const actionHandlers = {
      enable: enableCounter,
      disable: disableCounter,
      info: infoCounter,
    }

    const handler = actionHandlers[action]

    await handler({
      guildId: interaction.guild.id,
      channel,
      interaction,
    })
  },
}
