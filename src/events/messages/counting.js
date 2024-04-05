const { Events } = require('discord.js')
const { getCounterChannels } = require('../../controllers/counter')

module.exports = {
  name: Events.MessageCreate,
  async execute(message) {
    const counterChannels = await getCounterChannels({
      guildId: message.guildId,
    })

    if (
      !counterChannels ||
      !counterChannels.channelIds.includes(message.channelId)
    )
      return

    if (isNaN(message.content)) return await message.delete()

    let lastNumber = 0
    const previousMessage = await message.channel.messages.fetch({
      before: message.id,
      limit: 1,
    })
    if (previousMessage.size > 0) {
      lastNumber = parseInt(previousMessage.first().content)
    }
    const expectedNumber = lastNumber + 1

    if (parseInt(message.content) !== expectedNumber) {
      await message.delete()
    }
  },
}
