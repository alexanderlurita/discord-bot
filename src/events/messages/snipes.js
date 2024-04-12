const { Events } = require('discord.js')

module.exports = {
  name: Events.MessageDelete,
  async execute(message, client) {
    const hasContent = message.content
    const hasImageAttachment =
      message.attachments.size > 0 &&
      message.attachments.first().contentType.startsWith('image')

    if (!hasContent && !hasImageAttachment) return

    client.snipes.set(message.channel.id, message)
  },
}
