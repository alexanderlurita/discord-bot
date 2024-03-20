const { ActionRowBuilder, UserSelectMenuBuilder } = require('discord.js')

const { errorMessages } = require('../../../../constants/errorMessages')
const { buildUserInfoEmbed } = require('../../../../helpers/userTools')
const { createButton } = require('../../../../helpers/buttons')

module.exports = {
  subCommand: 'user.info',
  async execute(interaction, client) {
    const member = interaction.options.getMember('user') ?? interaction.member

    if (!member) {
      return await interaction.reply({
        content: errorMessages.userNotInServer,
        ephemeral: true,
      })
    }

    const embedBuilder = buildUserInfoEmbed({ member, client })

    const userSelectMenuRow = new ActionRowBuilder().addComponents(
      new UserSelectMenuBuilder()
        .setCustomId('change-member-info')
        .setPlaceholder('Selecciona un miembro del servidor'),
    )

    const showUserAvatarBtn = createButton({
      id: 'show-user-avatar',
      label: 'Mirar avatar',
      emoji: '🖼️',
    })

    const buttonsRow = new ActionRowBuilder().addComponents(showUserAvatarBtn)

    await interaction.reply({
      embeds: [embedBuilder],
      components: [userSelectMenuRow, buttonsRow],
    })
  },
}
