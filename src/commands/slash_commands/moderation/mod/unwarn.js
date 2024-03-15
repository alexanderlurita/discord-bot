const {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
  Colors,
  ComponentType,
  PermissionFlagsBits,
  bold,
  userMention,
} = require('discord.js')
const hd = require('humanize-duration')

const { errorMessages } = require('../../../../constants/errorMessages')
const { getUserWarns, deleteWarnById } = require('../../../../controllers/warn')
const { formatWarningDetails } = require('../../../../helpers/formatWarnings')

const userWarnsCache = {}
const BUTTONS_TIMEOUT = 60_000

function clearUserCache(userId) {
  delete userWarnsCache[userId]
}

function handleCollector({ reply, warnId, userId, interaction }) {
  const collectorFilter = (i) => i.user.id === interaction.user.id
  const collector = reply.createMessageComponentCollector({
    componentType: ComponentType.Button,
    filter: collectorFilter,
    time: BUTTONS_TIMEOUT,
  })

  collector.on('collect', async (i) => {
    if (i.customId === 'cancel') {
      return await reply.delete()
    }

    if (i.customId === 'confirm') {
      try {
        await deleteWarnById({
          guildId: interaction.guild.id,
          userId,
          warnId,
        })

        clearUserCache(userId)

        await i.update({
          content: `${userMention(
            i.user.id,
          )}, la advertencia ha sido removida.`,
          components: [],
        })
      } catch {
        await interaction.reply({
          content: 'Se produjo un error al eliminar la advertencia.',
          ephemeral: true,
        })
      }
    }
  })

  collector.on('end', async (collected) => {
    const userCollected = collected.find(
      (b) => b.user.id === interaction.user.id,
    )
    if (!userCollected) reply.delete()
  })
}

module.exports = {
  subCommand: 'mod.unwarn',

  async autocomplete(interaction) {
    const focusedOption = interaction.options.getFocused(true)
    const userId = interaction.options.get('member').value

    if (userWarnsCache[userId]) {
      const filteredWarns = userWarnsCache[userId].filter((warn) =>
        warn.reason.includes(focusedOption.value),
      )

      return await interaction.respond(
        filteredWarns.map((choice) => ({
          name: choice.reason,
          value: choice.value,
        })),
      )
    }

    const userWarns = await getUserWarns({
      guildId: interaction.guild.id,
      userId,
    })

    if (!userWarns) return await interaction.respond([])

    const userWarningsFormatted = userWarns.warnings
      .slice()
      .reverse()
      .map((warn) => {
        const timeAgo = Date.now() - warn.createdAt
        const timeFormat = hd(timeAgo, {
          language: 'es',
          round: true,
          largest: 1,
        })

        return {
          reason: `${warn.reason} (hace ${timeFormat})`,
          value: warn._id,
        }
      })

    const filteredWarns = userWarningsFormatted.filter((warn) =>
      warn.reason.includes(focusedOption.value),
    )

    userWarnsCache[userId] = userWarningsFormatted

    await interaction.respond(
      filteredWarns.map((choice) => ({
        name: choice.reason,
        value: choice.value,
      })),
    )
  },

  async execute(interaction, client) {
    const member = interaction.options.getMember('member')
    const warn = interaction.options.getString('warn')

    if (!interaction.member.permissions.has(PermissionFlagsBits.ManageRoles)) {
      return await interaction.reply({
        content: `${errorMessages.insufficientPermissions}\nRequiere: \`MANAGE_ROLES\``,
        ephemeral: true,
      })
    }

    if (!member) {
      return await interaction.reply({
        content: errorMessages.userNotInServer,
        ephemeral: true,
      })
    }

    if (member.user.id === client.user.id) {
      return await interaction.reply({
        content: errorMessages.cannotUseAgainst,
        ephemeral: true,
      })
    }

    if (member.user.bot) {
      return await interaction.reply({
        content: errorMessages.cannotPerformActionOnBot('desadvertir'),
        ephemeral: true,
      })
    }

    const userWarnings = await getUserWarns({
      guildId: interaction.guild.id,
      userId: member.user.id,
    })

    if (!userWarnings || !userWarnings.warnings.length === 0) {
      return await interaction.reply({
        content: `${bold(member.user.username)} no tiene advertencias.`,
        ephemeral: true,
      })
    }

    const warnData = userWarnings.warnings.find((w) => w._id.equals(warn))

    if (!warnData) {
      return await interaction.reply({
        content:
          'Advertencia no encontrada. Por favor seleccione una opción de la lista.',
        ephemeral: true,
      })
    }

    const formattedWarningDetail = formatWarningDetails({
      user: member.user,
      warn: warnData,
    })

    const embed = new EmbedBuilder()
      .setColor(Colors.Red)
      .addFields(formattedWarningDetail)

    const controls = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId('cancel')
        .setLabel('Cancelar')
        .setStyle(ButtonStyle.Danger),

      new ButtonBuilder()
        .setCustomId('confirm')
        .setLabel('Confirmar')
        .setStyle(ButtonStyle.Success),
    )

    const reply = await interaction.reply({
      content: `${userMention(
        interaction.user.id,
      )}, ¿estás seguro de eliminar la advertencia de ${bold(
        member.user.username,
      )}?`,
      embeds: [embed],
      components: [controls],
    })

    handleCollector({
      reply,
      warnId: warn,
      userId: member.user.id,
      interaction,
    })
  },
}
