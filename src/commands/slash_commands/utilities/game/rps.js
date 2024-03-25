const {
  ActionRowBuilder,
  Colors,
  ComponentType,
  EmbedBuilder,
  bold,
  userMention,
} = require('discord.js')
const { createButton } = require('../../../../helpers/buttons')
const { getRandom } = require('../../../../utils/getRandom')

module.exports = {
  subCommand: 'game.rps',
  async execute(interaction, client) {
    const userDisplayName =
      interaction.user.username ?? interaction.user.username

    const embed = new EmbedBuilder()
      .setColor(Colors.Green)
      .setAuthor({
        name: `${userDisplayName} contra mí`,
      })
      .addFields(
        {
          name: userDisplayName,
          value: '¡Presiona un botón!',
          inline: true,
        },
        {
          name: client.user.username,
          value: 'Esperando mi turno',
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
      content: `[ ${userMention(interaction.user.id)} vs ${userMention(
        client.user.id,
      )}]`,
      embeds: [embed],
      components: [row],
    })

    const collectorFilter = (i) => i.user.id === interaction.user.id
    const collector = reply.createMessageComponentCollector({
      componentType: ComponentType.Button,
      filter: collectorFilter,
      time: 30_000,
    })

    collector.on('collect', async (i) => {
      const optionsIds = buttons.map(({ id }) => id)
      const botChoiceId = getRandom(optionsIds)
      const userChoiceId = i.customId

      const userChoice = buttons.find(({ id }) => id === userChoiceId)
      const botChoice = buttons.find(({ id }) => id === botChoiceId)

      embed.spliceFields(0, 2).addFields(
        {
          name: userDisplayName,
          value: `${userChoice.emoji} ${userChoice.label}`,
          inline: true,
        },
        {
          name: client.user.username,
          value: `${botChoice.emoji} ${botChoice.label}`,
          inline: true,
        },
      )

      let result
      if (userChoiceId === botChoiceId) {
        result = 'Es un empate'
      } else if (
        (userChoiceId === 'rps-rock' && botChoiceId === 'rps-scissor') ||
        (userChoiceId === 'rps-paper' && botChoiceId === 'rps-rock') ||
        (userChoiceId === 'rps-scissor' && botChoiceId === 'rps-paper')
      ) {
        result = 'Has ganado'
      } else {
        result = '¡He ganadooo!'
      }

      embed.addFields({ name: 'Resultado', value: result })
      row.components.forEach((btn) => btn.setDisabled(true))

      await i.update({ embeds: [embed], components: [row] })
    })

    collector.on('end', async (collected) => {
      const userCollected = collected.find(
        (b) => b.user.id === interaction.user.id,
      )

      if (!userCollected) {
        row.components.forEach((btn) => btn.setDisabled(true))
        embed.setColor(Colors.Red).addFields({
          name: 'Resultado',
          value: `${bold(
            userDisplayName,
          )} tardó mucho en responder.\n¿Te has asustado?`,
        })

        await reply.edit({ embeds: [embed], components: [row] })
      }
    })
  },
}
