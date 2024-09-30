const {
  ChannelType,
  SlashCommandBuilder,
  PermissionFlagsBits,
} = require('discord.js')
const https = require('node:https')
const fs = require('node:fs')

module.exports = {
  developer: true,
  data: new SlashCommandBuilder()
    .setName('transfer')
    .setDescription('nsfw file transfer')
    .addIntegerOption(
      (option) =>
        option
          .setName('amount')
          .setDescription(
            'Number of messages to transfer and check (between 1 and 1000).',
          )
          .setRequired(true)
          .setMinValue(1) // Minimum value
          .setMaxValue(1000), // Maximum value
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  async execute(interaction) {
    const amount = interaction.options.getInteger('amount')

    // Source and destination channel IDs (Replace with yours)
    const sourceID = '811359340396412948' // Source channel ID
    const destinationID = '1228458602042228787' // Destination channel ID

    try {
      // Fetch source and destination channels
      const sourceChannel = await interaction.client.channels.fetch(sourceID)
      const destinationChannel = await interaction.client.channels.fetch(
        destinationID,
      )

      if (!sourceChannel || !destinationChannel) {
        return interaction.reply({
          content: 'No se pudo encontrar uno de los canales. Verifica los IDs.',
          ephemeral: true,
        })
      }

      // Check if both channels are text channels
      if (
        sourceChannel.type !== ChannelType.GuildText ||
        destinationChannel.type !== ChannelType.GuildText
      ) {
        return interaction.reply({
          content: 'Ambos canales deben ser de tipo texto.',
          ephemeral: true,
        })
      }

      // Inform the user that the process is underway with ephemeral message
      await interaction.reply({
        content: `Transferencia iniciada. Transfiriendo ${amount} mensajes del canal ${sourceChannel.name} al canal ${destinationChannel.name}...`,
        ephemeral: true,
      })

      console.log(`Transferencia iniciada con ${amount} mensajes.`)

      const fetchedMessages = []
      let lastMessageId = null

      // Fetch messages in batches of 100 until the desired amount is reached
      while (fetchedMessages.length < amount) {
        const remaining = amount - fetchedMessages.length
        const fetchLimit = remaining > 100 ? 100 : remaining // Fetch only the remaining amount, max 100

        // Fetch the messages, starting from the last message fetched in the previous iteration
        const options = { limit: fetchLimit }
        if (lastMessageId) options.before = lastMessageId

        const messages = await sourceChannel.messages.fetch(options)

        // Stop if no more messages are available
        if (messages.size === 0) break

        fetchedMessages.push(...messages.values())
        lastMessageId = messages.last().id // Update the last message ID to the newest one fetched
      }

      console.log(
        `Se han obtenido ${fetchedMessages.length} mensajes en total.`,
      )

      let transferCount = 0 // Messages successfully transferred with attachments
      let deletedCount = 0 // Messages deleted without attachments
      let skippedSizeCount = 0 // Messages not sent due to attachment size

      // Iterate through fetched messages to handle attachments and delete messages without attachments
      for (const msg of fetchedMessages) {
        const filesToSend = [] // Array to store files to send

        if (msg.attachments.size > 0) {
          // Process each attachment
          for (const [_, attachment] of msg.attachments) {
            // Check if the attachment is below 25 MB
            if (attachment.size <= 25 * 1024 * 1024) {
              // 25 MB in bytes
              // Filter only images, videos, or GIFs
              if (
                attachment.contentType.startsWith('image/') ||
                attachment.contentType.startsWith('video/') ||
                attachment.contentType.includes('gif')
              ) {
                console.log(`Descargando archivo: ${attachment.name}`)

                try {
                  // Download the file using https
                  const filePath = `./temp_${attachment.name}`
                  const file = fs.createWriteStream(filePath)

                  await new Promise((resolve, reject) => {
                    https
                      .get(attachment.url, (response) => {
                        response.pipe(file)
                        file.on('finish', () => {
                          file.close(resolve)
                        })
                      })
                      .on('error', (err) => {
                        fs.unlink(filePath, () => {}) // Remove the file on error
                        reject(err)
                      })
                  })

                  console.log(`Archivo guardado temporalmente: ${filePath}`)
                  filesToSend.push(filePath) // Add the file path to the files array
                } catch (error) {
                  console.error(`Error manejando el archivo: ${error.message}`)
                }
              }
            } else {
              // File is larger than 25 MB, delete the message and count it
              console.log(
                `Archivo ${attachment.name} omitido por exceder el límite de 25 MB.`,
              )
              await msg.delete()
              skippedSizeCount++
            }
          }

          // Check if there are files to send
          if (filesToSend.length > 0) {
            // Send the message with all attached files and the original message content
            await destinationChannel.send({
              content: msg.content || '', // Include the original message content (if any)
              files: filesToSend,
            })
            console.log(
              `Archivos enviados al canal de destino: ${destinationChannel.name}`,
            )

            // Delete each temporary file from the system
            for (const filePath of filesToSend) {
              fs.unlinkSync(filePath)
              console.log(`Archivo temporal eliminado: ${filePath}`)
            }

            // Delete the original message from the source channel
            await msg.delete()
            console.log(`Mensaje eliminado del canal de origen: ${msg.id}`)

            // Increase the count of successful transfers
            transferCount++
          }
        } else {
          // Delete messages without attachments (neither images, videos, nor GIFs)
          await msg.delete()
          console.log(
            `Mensaje sin adjuntos eliminado del canal de origen: ${msg.id}`,
          )
          deletedCount++
        }
      }

      console.log(
        `Transferencia completada. Se transfirieron y eliminaron ${transferCount} mensajes con adjuntos.`,
      )
      console.log(`Eliminados ${deletedCount} mensajes sin adjuntos.`)
      console.log(
        `Omitidos ${skippedSizeCount} mensajes por superar el tamaño máximo de 25 MB.`,
      )

      // Separate the final reply message into three parts for clarity
      await interaction.editReply({
        content:
          `**Transferencia completada**:\n\n` +
          `✅ **Mensajes transferidos**: ${transferCount} mensajes con archivos adjuntos.\n` +
          `🗑️ **Mensajes eliminados**: ${deletedCount} mensajes sin adjuntos.\n` +
          `⚠️ **Mensajes omitidos**: ${skippedSizeCount} mensajes con archivos que superaron los 25 MB de tamaño.`,
        ephemeral: true,
      })
    } catch (error) {
      console.error(`Error durante la transferencia: ${error.message}`)
      await interaction.editReply({
        content: `Ocurrió un error durante la transferencia: ${error.message}`,
        ephemeral: true,
      })
    }
  },
}
