const {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
} = require('discord.js')
const { colors } = require('../../../../constants/colors')

module.exports = {
  subCommand: 'user.avatar',
  async execute(interaction) {
    const member = interaction.options.getMember('user') || interaction.member

    const avatar = member.user
      .displayAvatarURL({ dynamic: true, size: 2048 })
      .replace('webp', 'png')

    const embedBuilder = new EmbedBuilder()
      .setColor(colors.warning)
      .setTitle(`Avatar de ${member.user.globalName || member.user.username}`)
      .setImage(avatar)

    const buttons = new ActionRowBuilder().addComponents([
      new ButtonBuilder()
        .setLabel('Ver en navegador')
        .setStyle(ButtonStyle.Link)
        .setURL(avatar),
    ])

    await interaction.reply({ embeds: [embedBuilder], components: [buttons] })
  },
}
