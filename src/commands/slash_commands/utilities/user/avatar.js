const { ActionRowBuilder } = require('discord.js')
const { errorMessages } = require('../../../../constants/errorMessages')
const {
  buildUserAvatarEmbed,
  getAvatarURL,
} = require('../../../../helpers/userTools')
const { createLinkButton } = require('../../../../helpers/buttons')

module.exports = {
  subCommand: 'user.avatar',
  async execute(interaction) {
    const user = interaction.options.getUser('user') ?? interaction.user

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

    await interaction.reply({ embeds: [embed], components: [row] })
  },
}
