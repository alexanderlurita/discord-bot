const { EmbedBuilder, SlashCommandBuilder } = require('discord.js')
const { getRandomFromArray } = require('../../../utils/random')
const { eightBallResponses } = require('../../../constants/responses')
const { colors } = require('../../../constants/colors')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('8ball')
    .setDescription('Ask the magic ball')
    .setDMPermission(false)
    .addStringOption((option) =>
      option
        .setName('question')
        .setDescription('The question you want to ask')
        .setRequired(true),
    ),
  async execute(interaction, client) {
    const question = interaction.options.getString('question')

    const anwser = getRandomFromArray(eightBallResponses)

    const embedBuilder = new EmbedBuilder()
      .setColor(colors.warning)
      .setDescription(`Bola mágica de ${client.user.username}`)
      .addFields(
        { name: 'Pregunta', value: question },
        { name: 'Respuesta', value: anwser },
      )

    await interaction.reply({ embeds: [embedBuilder] })
  },
}
