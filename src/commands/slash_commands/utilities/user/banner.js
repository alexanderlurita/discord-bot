const { ActionRowBuilder } = require('discord.js')
const {
  buildUserBannerEmbed,
  getBannerURL,
} = require('../../../../helpers/userTools')
const { createLinkButton } = require('../../../../helpers/buttons')

module.exports = {
  subCommand: 'user.banner',
  async execute(interaction) {
    const user = interaction.options.getUser('user') ?? interaction.member

    const { banner } = await user.fetch()

    if (!banner) {
      return await interaction.reply(
        interaction.user.id === user.id
          ? 'No tienes banner.'
          : `**${user.globalName ?? user.username}** no tiene banner.`,
      )
    }

    const bannerURL = getBannerURL({ user })

    const embed = buildUserBannerEmbed({ user })

    const linkButton = createLinkButton({
      label: 'Ver en navegador',
      url: bannerURL,
    })

    const row = new ActionRowBuilder().addComponents(linkButton)

    await interaction.reply({ embeds: [embed], components: [row] })
  },
}
