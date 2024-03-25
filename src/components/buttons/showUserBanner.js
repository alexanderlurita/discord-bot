const { ActionRowBuilder } = require('discord.js')
const { errorMessages } = require('../../constants/errorMessages')
const {
  getBannerURL,
  buildUserBannerEmbed,
} = require('../../helpers/userTools')
const { createLinkButton } = require('../../helpers/buttons')

module.exports = {
  name: 'show-user-banner',
  async execute(interaction, client) {
    const userId = interaction.message.embeds[0].data.url.split('/').pop()
    const user = await client.users
      .fetch(userId, { force: true })
      .catch(console.log)

    if (!user) {
      return await interaction.reply({
        content: errorMessages.userNotFound,
      })
    }

    const bannerURL = getBannerURL({ user })

    if (!bannerURL) {
      return await interaction.reply({
        content: 'El usuario no tiene banner.',
        ephemeral: true,
      })
    }

    const embed = buildUserBannerEmbed({ user })

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
