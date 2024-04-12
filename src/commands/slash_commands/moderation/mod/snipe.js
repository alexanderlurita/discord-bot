const { Colors, EmbedBuilder, PermissionFlagsBits } = require('discord.js')
const { errorMessages } = require('../../../../constants/errorMessages')

module.exports = {
  subCommand: 'mod.snipe',
  async execute(interaction, client) {
    if (
      !interaction.guild.members.me.permissions.has(
        PermissionFlagsBits.ManageMessages,
      )
    ) {
      return await interaction.reply({
        content: `${errorMessages.botInsufficientPermissions}\nRequiere: \`MANAGE_MESSAGES\``,
        ephemeral: true,
      })
    }

    const message = client.snipes.get(interaction.channel.id)

    if (!message) {
      return await interaction.reply({
        content: 'No he encontrado ningún mensaje eliminado en este canal.',
        ephemeral: true,
      })
    }

    const embed = new EmbedBuilder()
      .setColor(Colors.Blue)
      .setAuthor({
        name: message.author.username,
        iconURL: message.author.displayAvatarURL(),
        url: `https://discord.com/users/${message.author.id}`,
      })
      .setTimestamp(message.createdTimestamp)
      .setFooter({
        text: `Autor ID: ${message.author.id} | Mensaje ID: ${message.id}`,
      })

    if (message.content) {
      embed.addFields({
        name: 'Mensaje Eliminado',
        value:
          message.content.length > 1024
            ? `${message.content.substring(0, 1021)}...`
            : message.content,
      })
    }

    if (message.attachments.size > 0) {
      embed.addFields({
        name: 'Imagen Eliminada',
        value: 'Adjuntada abajo.',
      })
      embed.setImage(message.attachments.first().proxyURL)
    }

    await interaction.reply({ embeds: [embed] })
  },
}
