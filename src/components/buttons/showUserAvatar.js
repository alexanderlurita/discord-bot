const { ActionRowBuilder } = require('discord.js')
const { errorMessages } = require('../../constants/errorMessages')
const {
  getAvatarURL,
  buildUserAvatarEmbed,
} = require('../../helpers/userTools')
const { createLinkButton } = require('../../helpers/buttons')

module.exports = {
  name: 'show-user-avatar',
  async execute(interaction, client) {
    const userId = interaction.message.embeds[0].data.url.split('/').pop()
    const user = await client.users.fetch(userId).catch(console.error)

    if (!user) {
      return await interaction.reply({
        content: errorMessages.userNotFound,
        ephemeral: true,
      })
    }

    const avatarURL = getAvatarURL({ user })

    const embed = buildUserAvatarEmbed({ user })

    const linkButton = createLinkButton({
      label: 'Ver en navegador',
      url: avatarURL,
    })

    const row = new ActionRowBuilder().addComponents(linkButton)

    await interaction.reply({
      embeds: [embed],
      components: [row],
      ephemeral: true,
    })
  },
}
