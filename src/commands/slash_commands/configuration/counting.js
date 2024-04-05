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

async function enableCounter({ guildId, channelId, interaction }) {
  try {
    const savedCounter = await saveCounterChannel({ guildId, channelId })

    if (savedCounter) {
      await interaction.reply(
        `El contador se ha habilitado en ${channelMention(channelId)}.`,
      )
    }
  } catch {
    await interaction.reply(
      'Ocurrió un problema al intentar habilitar el contador.',
    )
  }
}

async function disableCounter({ guildId, channelId, interaction }) {
  try {
    await deleteChannelById({ guildId, channelId })

    await interaction.reply(
      `Contador desactivado en ${channelMention(channelId)}.`,
    )
  } catch {
    await interaction.reply(
      'Ocurrió un problema al intentar deshabilitar el contador.',
    )
  }
}

async function infoCounter({ guildId, channel, interaction }) {
  try {
    const counterChannels = await getCounterChannels({ guildId })

    if (!counterChannels || !counterChannels.channelIds.includes(channel.id)) {
      return await interaction.reply(
        `El contador no está habilitado para ${channelMention(channel.id)}.`,
      )
    }

    const messages = await channel.messages.fetch({ limit: 1 })
    const lastMessage = messages.first()

    let nextNumber
    if (!lastMessage || isNaN(parseInt(lastMessage.content))) {
      nextNumber = 1
    } else {
      nextNumber = parseInt(lastMessage.content) + 1
    }

    const embed = new EmbedBuilder().setColor(Colors.Green).addFields(
      {
        name: 'Channel',
        value: channelMention(channel.id),
      },
      {
        name: 'Next number',
        value: nextNumber.toString(),
      },
    )

    await interaction.reply({ embeds: [embed] })
  } catch {
    await interaction.reply(
      'Ocurrió un problema al intentar obtener información sobre el contador.',
    )
  }
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName('counting')
    .setDescription('Manage the counter in a specific channel')
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
      channelId: channel.id,
      interaction,
      channel,
    })
  },
}
