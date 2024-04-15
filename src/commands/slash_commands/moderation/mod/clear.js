const { PermissionFlagsBits, userMention } = require('discord.js')
const { errorMessages } = require('../../../../constants/errorMessages')

async function fetchMessages({ channel, quantity, userId }) {
  let lastId
  const allMessages = []

  while (allMessages.length < quantity) {
    const options = { limit: userId ? 100 : quantity }
    if (lastId) options.before = lastId

    const messages = await channel.messages.fetch(options)

    if (userId) {
      const userMessages = messages.filter((msg) => msg.author.id === userId)
      allMessages.push(...userMessages.values())
    } else {
      allMessages.push(...messages.values())
    }

    if (messages.size !== 100 || allMessages.length >= quantity) break

    lastId = messages.last().id
  }

  return allMessages.slice(0, quantity)
}

module.exports = {
  subCommand: 'mod.clear',
  async execute(interaction) {
    await interaction.deferReply({ ephemeral: true })

    const quantity = interaction.options.getInteger('quantity')
    const user = interaction.options.getUser('user')

    if (
      !interaction.member.permissions.has(PermissionFlagsBits.ManageMessages)
    ) {
      return await interaction.editReply(
        `${errorMessages.insufficientPermissions}\nRequiere: \`MANAGE_MESSAGES\``,
      )
    }

    if (
      !interaction.guild.members.me.permissions.has(
        PermissionFlagsBits.ManageMessages,
      )
    ) {
      return await interaction.editReply(
        `${errorMessages.botInsufficientPermissions}\nRequiere: \`MANAGE_MESSAGES\``,
      )
    }

    const messages = await fetchMessages({
      channel: interaction.channel,
      quantity,
      userId: user?.id,
    })

    if (messages.length === 0) {
      return await interaction.editReply(
        `No se encontraron mensajes para borrar${
          user ? ` de ${userMention(user.id)}.` : '.'
        }`,
      )
    }

    const oldMessages = []
    const recentMessages = []
    messages.forEach((message) => {
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
      return await interaction.editReply(
        'Ocurrió un error al intentar borrar mensajes.',
      )
    }

    await interaction.editReply(
      `¡He borrado \`${messages.length} ${
        messages.length === 1 ? 'mensaje' : 'mensajes'
      }\`${user ? ` de ${userMention(user.id)}` : ''}!`,
    )
  },
}
