const { WarnModel } = require('../models/warn')

async function createWarn({ guildId, userId, warnData }) {
  try {
    let userWarn = await WarnModel.findOne({ userId, guildId })

    if (!userWarn) {
      userWarn = new WarnModel({
        userId,
        guildId,
        warnings: [warnData],
      })
    } else {
      userWarn.warnings.push(warnData)
    }

    await userWarn.save()

    return userWarn
  } catch {
    throw new Error('Error creating warning')
  }
}

module.exports = { createWarn }
