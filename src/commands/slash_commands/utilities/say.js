const {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  SlashCommandBuilder,
} = require('discord.js')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('say')
    .setDescription('Send a message through me')
    .setDMPermission(false)
    .addStringOption((option) =>
      option
        .setName('content')
        .setDescription('The content of the message to send')
        .setRequired(true),
    ),

  async execute(interaction) {
    const message = interaction.options.getString('content')
    const user = interaction.member.nickname ?? interaction.user.globalName
    let sentMessage

    const actionRowBuilder = new ActionRowBuilder().addComponents([
      new ButtonBuilder()
        .setCustomId(interaction.id)
        .setLabel(`Enviado por ${user}`)
        .setStyle(ButtonStyle.Secondary)
        .setDisabled(true),
    ])

    try {
      sentMessage = await interaction.channel.send({
        content: message,
        components: [actionRowBuilder],
      })
    } catch (err) {
      console.log(err)
    }

    await interaction.reply({
      content: sentMessage ? 'Mensaje enviado' : 'No pude enviar el mensaje',
      ephemeral: true,
    })
  },
}
