const { PermissionFlagsBits } = require('discord.js')
const { errorMessages } = require('../../../../constants/errorMessages')

module.exports = {
  subCommand: 'mod.clear',
  async execute(interaction) {
    await interaction.deferReply({ ephemeral: true })

    const quantity = interaction.options.getInteger('quantity')
    const user = interaction.options.getUser('user')

    if (
      !interaction.member.permissions.has(PermissionFlagsBits.ManageMessages)
    ) {
      return await interaction.editReply({
        content: `${errorMessages.insufficientPermissions}\nRequiere: \`MANAGE_MESSAGES\``,
      })
    }

    if (
      !interaction.guild.members.me.permissions.has(
        PermissionFlagsBits.ManageMessages,
      )
    ) {
      return await interaction.editReply({
        content: `${errorMessages.botInsufficientPermissions}\nRequiere: \`MANAGE_MESSAGES\``,
      })
    }

    const messages = await interaction.channel.messages.fetch({ limit: 99 })

    if (messages.size === 0) {
      return await interaction.editReply({
        content: 'No hay mensajes en este canal para eliminar',
      })
    }

    const messagesToDelete = user
      ? messages.filter((msg) => msg.author.id === user.id).first(quantity)
      : messages.first(quantity)

    if (messagesToDelete.length === 0) {
      return await interaction.editReply({
        content: `No se encontraron mensajes para borrar${
          user ? ' de ese usuario' : ''
        }`,
      })
    }

    try {
      await interaction.channel.bulkDelete(messagesToDelete, true)
    } catch (err) {
      console.error(err)
      return await interaction.editReply({
        content: 'Ocurrió un error al intentar borrar mensajes',
      })
    }

    await interaction.editReply({
      content: `¡He borrado \`${messagesToDelete.length} ${
        messagesToDelete.length === 1 ? 'mensaje' : 'mensajes'
      }\`!`,
    })
  },
}
