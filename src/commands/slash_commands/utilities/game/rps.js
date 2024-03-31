const {
  ActionRowBuilder,
  Colors,
  ComponentType,
  EmbedBuilder,
  bold,
  userMention,
} = require('discord.js')
const { createButton } = require('../../../../helpers/buttons')
const { getRandomFromArray } = require('../../../../utils/random')

async function handleBotTurn({
  buttons,
  embed,
  row,
  initiatorDisplayName,
  rivalDisplayName,
  interaction,
}) {
  const optionsIds = buttons.map(({ id }) => id)
  const rivalChoiceId = getRandomFromArray(optionsIds)
  const initiatorChoiceId = interaction.customId

  const initiatorChoice = buttons.find(({ id }) => id === initiatorChoiceId)
  const rivalChoice = buttons.find(({ id }) => id === rivalChoiceId)

  embed.spliceFields(0, 2).addFields(
    {
      name: initiatorDisplayName,
      value: `${initiatorChoice.emoji} ${initiatorChoice.label}`,
      inline: true,
    },
    {
      name: rivalDisplayName,
      value: `${rivalChoice.emoji} ${rivalChoice.label}`,
      inline: true,
    },
    {
      name: 'Resultado',
      value: getGameResult({
        initiatorChoiceId,
        rivalChoiceId,
        initiatorDisplayName,
        rivalDisplayName,
      }),
    },
  )

  row.components.forEach((btn) => btn.setDisabled(true))

  await interaction.update({ embeds: [embed], components: [row] })
}

async function handleInitiatorTurn({
  embed,
  initiatorDisplayName,
  rivalDisplayName,
  initiatorChoice,
  interaction,
}) {
  embed.spliceFields(0, 2).addFields(
    {
      name: initiatorDisplayName,
      value: `Esperando turno`,
      inline: true,
    },
    {
      name: rivalDisplayName,
      value: '¡Presiona un botón!',
      inline: true,
    },
  )

  await interaction.update({ embeds: [embed] })
  await interaction.followUp({
    content: `Has seleccionado ${initiatorChoice.emoji} ${bold(
      initiatorChoice.label,
    )}`,
    ephemeral: true,
  })
}

async function handleRivalTurn({
  embed,
  row,
  initiatorDisplayName,
  rivalDisplayName,
  initiatorChoice,
  rivalChoice,
  interaction,
}) {
  embed.spliceFields(0, 2).addFields(
    {
      name: initiatorDisplayName,
      value: `${initiatorChoice.emoji} ${initiatorChoice.label}`,
      inline: true,
    },
    {
      name: rivalDisplayName,
      value: `${rivalChoice.emoji} ${rivalChoice.label}`,
      inline: true,
    },
    {
      name: 'Resultado',
      value: getGameResult({
        initiatorChoiceId: initiatorChoice.id,
        rivalChoiceId: rivalChoice.id,
        initiatorDisplayName,
        rivalDisplayName,
      }),
    },
  )

  row.components.forEach((btn) => btn.setDisabled(true))

  await interaction.update({ embeds: [embed], components: [row] })
  await interaction.followUp({
    content: `Has seleccionado ${rivalChoice.emoji} ${bold(rivalChoice.label)}`,
    ephemeral: true,
  })
}

function getGameResult({
  initiatorChoiceId,
  rivalChoiceId,
  initiatorDisplayName,
  rivalDisplayName,
}) {
  if (initiatorChoiceId === rivalChoiceId) {
    return 'Es un empate'
  } else if (
    (initiatorChoiceId === 'rps-rock' && rivalChoiceId === 'rps-scissor') ||
    (initiatorChoiceId === 'rps-paper' && rivalChoiceId === 'rps-rock') ||
    (initiatorChoiceId === 'rps-scissor' && rivalChoiceId === 'rps-paper')
  ) {
    return `${initiatorDisplayName} ha ganado`
  } else {
    return `${rivalDisplayName} ha ganado`
  }
}

module.exports = {
  subCommand: 'game.rps',

  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   * @param {Client} client
   */
  async execute(interaction, client) {
    const initiator = interaction.user
    const rival = interaction.options.getUser('user') ?? client.user

    if (initiator.id === rival.id) {
      return await interaction.reply({
        content:
          '¿No tienes con quién jugar?\nMencióname a mí y con gusto podemos jugar piedra, papel o tijeras. ',
        ephemeral: true,
      })
    }

    if (rival.bot && rival.id !== client.user.id) {
      return await interaction.reply({
        content: 'No puedes jugar contra otros bots aparte de mí.',
        ephemeral: true,
      })
    }

    const initiatorDisplayName = initiator.globalName ?? initiator.username
    const rivalDisplayName = rival.globalName ?? rival.username

    const embed = new EmbedBuilder()
      .setColor(Colors.Green)
      .setAuthor({
        name: `${initiatorDisplayName} contra ${
          rival.id === client.user.id ? 'mí' : `${rivalDisplayName}`
        }`,
      })
      .addFields(
        {
          name: initiatorDisplayName,
          value: '¡Presiona un botón!',
          inline: true,
        },
        {
          name: rivalDisplayName,
          value: `${
            rival.id === client.user.id
              ? 'Esperando mi turno'
              : 'Esperando su turno'
          }`,
          inline: true,
        },
      )

    const buttons = [
      { id: 'rps-rock', label: 'Piedra', emoji: '🪨' },
      { id: 'rps-paper', label: 'Papel', emoji: '🧻' },
      { id: 'rps-scissor', label: 'Tijeras', emoji: '✂️' },
    ]

    const row = new ActionRowBuilder().addComponents(buttons.map(createButton))

    const reply = await interaction.reply({
      content: `[ ${userMention(initiator.id)} vs ${userMention(rival.id)}]`,
      embeds: [embed],
      components: [row],
    })

    const context = {
      buttons,
      embed,
      row,
      initiatorDisplayName,
      rivalDisplayName,
    }

    const collectorFilter = (i) =>
      i.user.id === initiator.id || i.user.id === rival.id

    const collector = reply.createMessageComponentCollector({
      componentType: ComponentType.Button,
      filter: collectorFilter,
      time: 30_000,
    })

    let initiatorTurn = true
    let initiatorChoice = null
    let rivalChoice = null

    collector.on('collect', async (i) => {
      if (rival.id === client.user.id) {
        return await handleBotTurn({ ...context, interaction: i })
      }

      if (!initiatorChoice && i.user.id === rival.id) {
        return await i.reply({
          content: `Aún no es tu turno.\nSolo ${userMention(
            initiator.id,
          )} puede usar esta interacción.`,
          ephemeral: true,
        })
      }

      if (initiatorChoice && i.user.id === initiator.id) {
        return await i.reply({
          content: `Ya hiciste tu elección.\nSolo ${userMention(
            rival.id,
          )} puede usar esta interacción.`,
          ephemeral: true,
        })
      }

      if (initiatorTurn && i.user.id === initiator.id) {
        initiatorChoice = buttons.find(({ id }) => id === i.customId)

        await handleInitiatorTurn({
          embed,
          initiatorDisplayName,
          rivalDisplayName,
          initiatorChoice,
          interaction: i,
        })

        initiatorTurn = false
      } else if (!initiatorTurn && i.user.id === rival.id) {
        rivalChoice = buttons.find(({ id }) => id === i.customId)

        await handleRivalTurn({
          embed,
          row,
          initiatorDisplayName,
          rivalDisplayName,
          initiatorChoice,
          rivalChoice,
          interaction: i,
        })
      }
    })

    collector.on('end', async (collected) => {
      const initCollected = collected.some((b) => b.user.id === initiator.id)
      const rivalCollected = collected.some((b) => b.user.id === rival.id)
      let timeoutMessage = ''

      if (
        (!initCollected && rival.id === client.user.id) ||
        ((!initCollected || !rivalCollected) && rival.id !== client.user.id)
      ) {
        const tardiness = !initCollected
          ? initiatorDisplayName
          : rivalDisplayName

        timeoutMessage = `${bold(
          tardiness,
        )} tardó mucho en responder.\n¿Te has asustado?`
      }

      if (timeoutMessage) {
        row.components.forEach((btn) => btn.setDisabled(true))

        embed.setColor(Colors.Red).addFields({
          name: 'Resultado',
          value: timeoutMessage,
        })

        await reply.edit({ embeds: [embed], components: [row] })
      }
    })
  },
}
