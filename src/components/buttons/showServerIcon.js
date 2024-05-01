const { ActionRowBuilder } = require('discord.js')
const { buildGuildIconEmbed, getIconURL } = require('../../helpers/guildTools')
const { createLinkButton } = require('../../helpers/buttons')

module.exports = {
  name: 'show-server-icon',
  async execute(interaction) {
    const { guild } = interaction

    const iconURL = getIconURL({ guild })

    if (!iconURL) {
      return await interaction.reply({
        content: 'El servidor no tiene un ícono.',
        ephemeral: true,
      })
    }

    const embed = buildGuildIconEmbed({ guild })

    const linkButton = createLinkButton({
      label: 'Ver en navegador',
      url: iconURL,
    })

    const row = new ActionRowBuilder().addComponents(linkButton)

    await interaction.reply({
      embeds: [embed],
      components: [row],
      ephemeral: true,
    })
  },
}
