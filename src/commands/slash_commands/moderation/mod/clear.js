const { PermissionFlagsBits } = require('discord.js')
const { errorMessages } = require('../../../../constants/error_messages')

module.exports = {
  subCommand: 'mod.clear',
  async execute(interaction) {
    const quantity = interaction.options.getInteger('quantity')
    const user = interaction.options.getUser('user')

    if (
      !interaction.member.permissions.has(PermissionFlagsBits.ManageMessages)
    ) {
      return await interaction.reply({
        content: `${errorMessages.insufficientPermissions}\nRequire: \`MANAGE_MESSAGES\``,
        ephemeral: true,
      })
    }

    if (
      !interaction.guild.members.me.permissions.has(
        PermissionFlagsBits.ManageMessages,
      )
    ) {
      return await interaction.reply({
        content: `${errorMessages.botInsufficientPermissions}\nRequire: \`MANAGE_MESSAGES\``,
        ephemeral: true,
      })
    }

    const messages = await interaction.channel.messages.fetch({ limit: 99 })

    if (messages.size === 0) {
      return await interaction.reply({
        content: 'No hay mensajes en este canal para eliminar',
        ephemeral: true,
      })
    }

    const messagesToDelete = user
      ? messages.filter((msg) => msg.author.id === user.id).first(quantity)
      : messages.first(quantity)

    if (messagesToDelete.length === 0) {
      return await interaction.reply({
        content: `No se encontraron mensajes para borrar${
          user ? ' de ese usuario' : ''
        }`,
        ephemeral: true,
      })
    }

    await interaction.deferReply({ ephemeral: true })

    try {
      await interaction.channel.bulkDelete(messagesToDelete, true)
    } catch (err) {
      console.error(err)
      return await interaction.editReply({
        content: 'Ocurrió un error al intentar borrar mensajes',
        ephemeral: true,
      })
    }

    await interaction.editReply({
      content: `¡He borrado \`${messagesToDelete.length} ${
        messagesToDelete.length === 1 ? 'mensaje' : 'mensajes'
      }\`!`,
    })
  },
}
