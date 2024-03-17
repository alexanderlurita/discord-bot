const {
  PermissionFlagsBits,
  bold,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  userMention,
  underscore,
  ComponentType,
} = require('discord.js')
const { errorMessages } = require('../../../../constants/errorMessages')
const { getUserWarns, clearUserWarns } = require('../../../../controllers/warn')

const BUTTONS_TIMEOUT = 30_000

function handleCollector({ reply, userWarnings, member, interaction }) {
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

    if (i.customId === 'delete') {
      try {
        await clearUserWarns({
          guildId: interaction.guild.id,
          userId: member.user.id,
        })

        await i.update({
          content: `¡${userMention(i.user.id)}, listo! He eliminado ${bold(
            `${userWarnings.warnings.length} advertencia(s)`,
          )} de ${bold(member.user.username)}`,
          components: [],
        })
      } catch {
        await interaction.reply({
          content: 'Se produjo un error al eliminar todas las advertencias.',
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
  subCommand: 'mod.clearwarns',
  async execute(interaction) {
    const member = interaction.options.getMember('member')

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

    const controls = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId('cancel')
        .setLabel('Cancelar')
        .setStyle(ButtonStyle.Secondary),

      new ButtonBuilder()
        .setCustomId('delete')
        .setLabel('Eliminar')
        .setStyle(ButtonStyle.Danger),
    )

    const reply = await interaction.reply({
      content: `${userMention(
        interaction.user.id,
      )}, ¿estás seguro de eliminar ${bold(
        `TODAS (${userWarnings.warnings.length})`,
      )} las advertencias de ${bold(member.user.username)}?\n${underscore(
        '⚠️ Esta acción es irreversible ⚠️',
      )}`,
      components: [controls],
    })

    handleCollector({ reply, userWarnings, member, interaction })
  },
}
