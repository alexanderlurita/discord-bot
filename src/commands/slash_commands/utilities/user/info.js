const {
  ActionRowBuilder,
  UserSelectMenuBuilder,
  ComponentType,
} = require('discord.js')
const { buildUserEmbed } = require('../../../../helpers/buildUserEmbed')
const { errorMessages } = require('../../../../constants/errorMessages')

function handleCollector({ reply, controls, interaction, client }) {
  const collectorFilter = (i) =>
    i.user.id === interaction.user.id && i.customId === interaction.id

  const collector = reply.createMessageComponentCollector({
    componentType: ComponentType.UserSelect,
    filter: collectorFilter,
    time: 60_000,
  })

  collector.on('collect', async (i) => {
    const memberId = i.values[0]

    const selectedMember = interaction.guild.members.cache.get(memberId)
    if (!selectedMember) return

    const embed = buildUserEmbed({ member: selectedMember, client })

    await i.update({ embeds: [embed] })
  })

  collector.on('end', async () => {
    controls.components.forEach((control) => control.setDisabled(true))
    await reply.edit({ components: [controls] })
  })
}

module.exports = {
  subCommand: 'user.info',
  async execute(interaction, client) {
    const member = interaction.options.getMember('user') || interaction.member

    if (!member) {
      return await interaction.reply({
        content: errorMessages.userNotInServer,
        ephemeral: true,
      })
    }

    const embedBuilder = buildUserEmbed({ member, client })

    const controls = new ActionRowBuilder().addComponents(
      new UserSelectMenuBuilder()
        .setCustomId(interaction.id)
        .setPlaceholder('Selecciona un miembro del servidor'),
    )

    const reply = await interaction.reply({
      embeds: [embedBuilder],
      components: [controls],
    })

    handleCollector({ reply, controls, interaction, client })
  },
}
