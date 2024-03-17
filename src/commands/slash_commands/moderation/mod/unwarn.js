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

const { errorMessages } = require('../../../../constants/errorMessages')
const { getUserWarns, deleteWarnById } = require('../../../../controllers/warn')
const {
  formatSimpleWarningsList,
  formatDetailedWarning,
} = require('../../../../helpers/formatWarnings')
const { formatChoice } = require('../../../../utils/formatChoice')

const BUTTONS_TIMEOUT = 60_000

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
    const focusedValue = interaction.options.getFocused()
    const userId = interaction.options.get('member').value
    const guildId = interaction.guild.id

    const userWarns = await getUserWarns({ guildId, userId })

    if (!userWarns || !userWarns.warnings.length) {
      return await interaction.respond([])
    }

    const formattedWarns = formatSimpleWarningsList({
      warnings: userWarns.warnings,
    })

    const filteredWarns = formattedWarns.filter((warn) =>
      warn.reason.includes(focusedValue),
    )

    await interaction.respond(filteredWarns.map(formatChoice))
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

    const formattedWarningDetail = formatDetailedWarning({
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
