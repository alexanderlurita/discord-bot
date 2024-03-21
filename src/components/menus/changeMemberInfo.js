const { errorMessages } = require('../../constants/errorMessages')
const { buildUserInfoEmbed } = require('../../helpers/userTools')

module.exports = {
  name: 'change-member-info',
  async execute(interaction, client) {
    if (interaction.user.id !== interaction.message.interaction.user.id) return

    const memberId = interaction.values[0]

    const selectedMember = interaction.guild.members.cache.get(memberId)
    if (!selectedMember) {
      return await interaction.reply({
        content: errorMessages.userNotInServer,
        ephemeral: true,
      })
    }

    const embed = buildUserInfoEmbed({ member: selectedMember, client })

    await interaction.update({ embeds: [embed] })
  },
}
