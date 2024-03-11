const { WarnModel } = require('../models/warn')

async function getUserWarningsFromGuild({ guildId, userId }) {
  try {
    const userWarnings = await WarnModel.findOne({ guildId, userId })
    return userWarnings
  } catch {
    throw new Error('Error fetching user warnings')
  }
}

async function createUserWarning({ guildId, userId, warnData }) {
  try {
    let userWarnings = await WarnModel.findOne({ userId, guildId })

    if (!userWarnings) {
      userWarnings = new WarnModel({
        userId,
        guildId,
        warnings: [warnData],
      })
    } else {
      userWarnings.warnings.push(warnData)
    }

    await userWarnings.save()

    return userWarnings
  } catch {
    throw new Error('Error creating user warning')
  }
}

module.exports = { getUserWarningsFromGuild, createUserWarning }
