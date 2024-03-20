const { errorMessages } = require('../../constants/errorMessages')
const { buildUserInfoEmbed } = require('../../helpers/userTools')

module.exports = {
  name: 'change-member-info',
  async execute(interaction, client) {
    const memberId = interaction.values[0]

    const selectedMember = interaction.guild.members.cache.get(memberId)
    if (!selectedMember) {
      return await interaction.followUp({
        content: errorMessages.userNotInServer,
        ephemeral: true,
      })
    }

    const embed = buildUserInfoEmbed({ member: selectedMember, client })

    await interaction.message.edit({ embeds: [embed] })
  },
}
