const {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
} = require('discord.js')
const { getUserData } = require('../../../../services/fetchUserData')
const { colors } = require('../../../../constants/colors')

module.exports = {
  subCommand: 'user.banner',
  async execute(interaction) {
    const member = interaction.options.getMember('user') || interaction.member

    let result

    try {
      result = await getUserData({ userId: member.user.id })
    } catch (err) {
      console.error(err)
      return await interaction.reply({
        content: 'Error al obtener los datos del usuario',
        ephemeral: true,
      })
    }

    const { banner } = result

    if (!banner) {
      return await interaction.reply(
        interaction.user.id === member.id
          ? 'No tienes banner'
          : `**${
              member.user.globalName ?? member.user.username
            }** no tiene banner`,
      )
    }

    const extension = banner.startsWith('a_') ? '.gif' : '.png'
    const url = `https://cdn.discordapp.com/banners/${member.user.id}/${banner}${extension}?size=2048`

    const embedBuilder = new EmbedBuilder()
      .setColor(colors.warning)
      .setTitle(`Banner de ${member.user.globalName ?? member.user.username}`)
      .setImage(url)

    const buttons = new ActionRowBuilder().addComponents([
      new ButtonBuilder()
        .setLabel('Ver en navegador')
        .setStyle(ButtonStyle.Link)
        .setURL(url),
    ])

    await interaction.reply({ embeds: [embedBuilder], components: [buttons] })
  },
}
