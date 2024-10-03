const {
  ActionRowBuilder,
  ButtonStyle,
  ComponentType,
  PermissionFlagsBits,
  bold,
  italic,
  userMention,
} = require('discord.js')
const { errorMessages } = require('../../../../constants/errorMessages')
const { createButton } = require('../../../../helpers/buttons')

const BUTTONS_TIMEOUT = 30_000

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

async function handleCollector({
  reply,
  recentMessages,
  oldMessages,
  user,
  interaction,
}) {
  const collector = reply.createMessageComponentCollector({
    componentType: ComponentType.Button,
    time: BUTTONS_TIMEOUT,
  })

  collector.on('collect', async (i) => {
    if (i.customId === 'cancel') {
      await interaction.editReply({
        content: 'Eliminación de mensajes cancelada.',
        components: [],
      })
    }

    if (i.customId === 'delete') {
      await interaction.editReply({
        content: italic('Eliminando...'),
        components: [],
      })

      await deleteRecentMessages(interaction.channel, recentMessages)
      await deleteOldMessages(oldMessages)

      await interaction.editReply({
        content: `¡He borrado \`${recentMessages.length + oldMessages.length} ${
          recentMessages.length + oldMessages.length === 1
            ? 'mensaje'
            : 'mensajes'
        }\`${user ? ` de ${userMention(user.id)}` : ''}!`,
        components: [],
      })
    }
  })

  collector.on('end', async (collected) => {
    const userCollected = collected.find(
      (b) => b.user.id === interaction.user.id,
    )

    if (!userCollected) {
      await interaction.editReply({
        content: '¡Tiempo agotado! Intenta de nuevo.',
        components: [],
      })
    }
  })
}

async function deleteRecentMessages(channel, recentMessages) {
  try {
    await channel.bulkDelete(recentMessages, true)
  } catch (err) {
    console.log(err)
    throw new Error('Ocurrió un error al intentar borrar mensajes recientes.')
  }
}

async function deleteOldMessages(oldMessages) {
  try {
    for (const message of oldMessages) {
      await message.delete()
    }
  } catch (err) {
    console.log(err)
    throw new Error('Ocurrió un error al intentar borrar mensajes antiguos.')
  }
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
      if (oldMessages.length > 0) {
        const buttons = [
          { id: 'cancel', label: 'Cancelar', style: ButtonStyle.Secondary },
          { id: 'delete', label: 'Eliminar', style: ButtonStyle.Danger },
        ]

        const row = new ActionRowBuilder().addComponents(
          buttons.map(createButton),
        )

        const messageCount = oldMessages.length
        const messageCountText =
          messageCount === 1
            ? '1 mensaje antiguo'
            : `${messageCount} mensajes antiguos`
        const confirmationText = `Se ha encontrado ${bold(
          messageCountText,
        )}. ¿Estás seguro de eliminar?`

        const reply = await interaction.editReply({
          content: confirmationText,
          components: [row],
        })

        await handleCollector({
          reply,
          recentMessages,
          oldMessages,
          user,
          interaction,
        })
      } else {
        await deleteRecentMessages(interaction.channel, recentMessages)

        await interaction.editReply(
          `¡He borrado \`${messages.length} ${
            messages.length === 1 ? 'mensaje' : 'mensajes'
          }\`${user ? ` de ${userMention(user.id)}` : ''}!`,
        )
      }
    } catch (err) {
      console.log(err)
      return await interaction.editReply(
        'Ocurrió un error al intentar borrar mensajes.',
      )
    }
  },
}
