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

    const messages = await interaction.channel.messages.fetch({
      limit: user ? 100 : quantity,
    })

    if (messages.size === 0) {
      return await interaction.editReply({
        content: 'No hay mensajes en este canal para eliminar.',
      })
    }

    const filteredMessages = user
      ? messages.filter((msg) => msg.author.id === user.id).first(quantity)
      : messages.first(quantity)

    if (filteredMessages.length === 0) {
      return await interaction.editReply({
        content: `No se encontraron mensajes para borrar${
          user ? ' de ese usuario.' : '.'
        }`,
      })
    }

    const oldMessages = []
    const recentMessages = []
    filteredMessages.forEach((message) => {
      if (Date.now() - message.createdTimestamp > 1209600000) {
        oldMessages.push(message)
      } else {
        recentMessages.push(message)
      }
    })

    try {
      if (recentMessages.length > 0) {
        await interaction.channel.bulkDelete(recentMessages, true)
      }
      for (const message of oldMessages) {
        await message.delete()
      }
    } catch (err) {
      console.log(err)
      return await interaction.editReply({
        content: 'Ocurrió un error al intentar borrar mensajes.',
      })
    }

    await interaction.editReply({
      content: `¡He borrado \`${recentMessages.length + oldMessages.length} ${
        recentMessages.length + oldMessages.length === 1
          ? 'mensaje'
          : 'mensajes'
      }\`!`,
    })
  },
}
