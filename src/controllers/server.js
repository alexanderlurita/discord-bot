const { ServerModel } = require('../models/server')

async function getServerConfig({ guildId }) {
  try {
    const serverConfig = await ServerModel.findOne({ guildId })
    return serverConfig
  } catch {
    throw new Error('Error fetching server')
  }
}

async function saveServerConfig({ guildId, ...data }) {
  try {
    let serverConfig = await ServerModel.findOne({ guildId })

    if (!serverConfig) {
      serverConfig = new ServerModel({ guildId, ...data })
    } else {
      for (const key in data) {
        if (serverConfig[key] && typeof serverConfig[key] === 'object') {
          serverConfig[key] = { ...serverConfig[key], ...data[key] }
        } else {
          serverConfig[key] = data[key]
        }
      }
    }

    await serverConfig.save()

    return serverConfig
  } catch {
    throw new Error('Error saving server config')
  }
}

module.exports = { getServerConfig, saveServerConfig }
