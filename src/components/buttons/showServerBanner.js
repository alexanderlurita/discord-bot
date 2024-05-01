const { ActionRowBuilder } = require('discord.js')
const {
  buildGuildBannerEmbed,
  getBannerURL,
} = require('../../helpers/guildTools')
const { createLinkButton } = require('../../helpers/buttons')

module.exports = {
  name: 'show-server-banner',
  async execute(interaction) {
    const { guild } = interaction

    const bannerURL = getBannerURL({ guild })

    if (!bannerURL) {
      return await interaction.reply({
        content: 'El servidor no tiene un banner.',
        ephemeral: true,
      })
    }

    const embed = buildGuildBannerEmbed({ guild })

    const linkButton = createLinkButton({
      label: 'Ver en navegador',
      url: bannerURL,
    })

    const row = new ActionRowBuilder().addComponents(linkButton)

    await interaction.reply({
      embeds: [embed],
      components: [row],
      ephemeral: true,
    })
  },
}
