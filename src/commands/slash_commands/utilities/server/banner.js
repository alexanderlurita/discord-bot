const { ActionRowBuilder, EmbedBuilder } = require('discord.js')
const { colors } = require('../../../../constants/colors')
const { createLinkButton } = require('../../../../helpers/buttons')

module.exports = {
  subCommand: 'server.banner',
  async execute(interaction) {
    const banner = interaction.guild
      .bannerURL({ dynamic: true, size: 2048 })
      ?.replace('webp', 'png')

    if (!banner) {
      return await interaction.reply('El servidor no tiene un banner.')
    }

    const embedBuilder = new EmbedBuilder()
      .setColor(colors.warning)
      .setTitle(`Banner de fondo de ${interaction.guild.name}`)
      .setImage(banner)

    const linkButton = createLinkButton({
      label: 'Ver en navegador',
      url: banner,
    })

    const row = new ActionRowBuilder().addComponents(linkButton)

    await interaction.reply({ embeds: [embedBuilder], components: [row] })
  },
}
