const { ActionRowBuilder, EmbedBuilder } = require('discord.js')
const { colors } = require('../../../../constants/colors')
const { createLinkButton } = require('../../../../helpers/buttons')

module.exports = {
  subCommand: 'server.icon',
  async execute(interaction) {
    const icon = interaction.guild
      .iconURL({ dynamic: true, size: 2048 })
      ?.replace('webp', 'png')

    if (!icon) {
      return await interaction.reply('El servidor no tiene un ícono.')
    }

    const embedBuilder = new EmbedBuilder()
      .setColor(colors.warning)
      .setTitle(`Ícono de ${interaction.guild.name}`)
      .setImage(icon)

    const linkButton = createLinkButton({
      label: 'Ver en navegador',
      url: icon,
    })

    const row = new ActionRowBuilder().addComponents(linkButton)

    await interaction.reply({ embeds: [embedBuilder], components: [row] })
  },
}
