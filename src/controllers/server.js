const { ServerModel } = require('../models/server')

async function getServerById({ guildId }) {
  try {
    const server = await ServerModel.findOne({ guildId })
    return server
  } catch {
    throw new Error('Error fetching server')
  }
}

module.exports = { getServerById }
