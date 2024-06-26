const { ActionRowBuilder } = require('discord.js')
const { createLinkButton } = require('../../../../helpers/buttons')
const {
  buildGuildBannerEmbed,
  getBannerURL,
} = require('../../../../helpers/guildTools')

module.exports = {
  subCommand: 'server.banner',
  async execute(interaction) {
    const { guild } = interaction

    const bannerURL = getBannerURL({ guild })

    if (!bannerURL) {
      return await interaction.reply('El servidor no tiene un banner.')
    }

    const embed = buildGuildBannerEmbed({ guild })

    const linkButton = createLinkButton({
      label: 'Ver en navegador',
      url: bannerURL,
    })

    const row = new ActionRowBuilder().addComponents(linkButton)

    await interaction.reply({ embeds: [embed], components: [row] })
  },
}
