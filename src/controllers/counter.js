const { CounterModel } = require('../models/counter')

async function getCounterChannels({ guildId }) {
  try {
    const counterChannels = await CounterModel.findOne({ guildId })
    return counterChannels
  } catch {
    throw new Error('Error fetching counter channels')
  }
}

async function saveCounterChannel({ guildId, channelId }) {
  try {
    let counter = await CounterModel.findOne({ guildId })

    if (!counter) {
      counter = new CounterModel({ guildId, channelIds: [channelId] })
    } else {
      if (!counter.channelIds.includes(channelId)) {
        counter.channelIds.push(channelId)
      }
    }

    await counter.save()

    return counter
  } catch {
    throw new Error('Error saving counter channel')
  }
}

async function deleteChannelById({ guildId, channelId }) {
  try {
    const counter = await CounterModel.findOne({ guildId })

    if (!counter) return counter

    const indexToDelete = counter.channelIds.indexOf(channelId)

    if (indexToDelete !== -1) {
      counter.channelIds.splice(indexToDelete, 1)
    }

    await counter.save()

    return counter
  } catch {
    throw new Error('Error deleting counter channel')
  }
}

module.exports = { getCounterChannels, saveCounterChannel, deleteChannelById }
