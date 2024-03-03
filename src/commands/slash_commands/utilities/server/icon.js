const {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
} = require('discord.js')
const { colors } = require('../../../../constants/colors')

module.exports = {
  subCommand: 'server.icon',
  async execute(interaction) {
    const icon = interaction.guild
      .iconURL({ dynamic: true, size: 2048 })
      ?.replace('webp', 'png')

    if (!icon) {
      return await interaction.reply('El servidor no tiene un ícono')
    }

    const embedBuilder = new EmbedBuilder()
      .setColor(colors.warning)
      .setTitle(`Ícono de ${interaction.guild.name}`)
      .setImage(icon)

    const buttons = new ActionRowBuilder().addComponents([
      new ButtonBuilder()
        .setLabel('Ver en navegador')
        .setStyle(ButtonStyle.Link)
        .setURL(icon),
    ])

    await interaction.reply({ embeds: [embedBuilder], components: [buttons] })
  },
}
