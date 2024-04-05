const { WarnModel } = require('../models/warn')

async function getUserWarns({ guildId, userId }) {
  try {
    const userWarns = await WarnModel.findOne({ guildId, userId })
    return userWarns
  } catch {
    throw new Error('Error fetching user warnings')
  }
}

async function saveUserWarn({ guildId, userId, warnData }) {
  try {
    let userWarns = await WarnModel.findOne({ userId, guildId })

    if (!userWarns) {
      userWarns = new WarnModel({
        userId,
        guildId,
        warnings: [warnData],
      })
    } else {
      userWarns.warnings.push(warnData)
    }

    await userWarns.save()

    return userWarns
  } catch {
    throw new Error('Error saving user warning')
  }
}

async function deleteWarnById({ guildId, userId, warnId }) {
  try {
    const userWarns = await WarnModel.findOne({ guildId, userId })

    if (!userWarns) return userWarns

    const indexToDelete = userWarns.warnings.findIndex((warn) =>
      warn._id.equals(warnId),
    )

    if (indexToDelete !== -1) {
      userWarns.warnings.splice(indexToDelete, 1)
    }

    await userWarns.save()

    return userWarns
  } catch {
    throw new Error('Error deleting user warning')
  }
}

async function clearUserWarns({ guildId, userId }) {
  try {
    const userWarns = await WarnModel.findOne({ guildId, userId })

    if (!userWarns) return userWarns

    userWarns.warnings = []
    await userWarns.save()

    return userWarns
  } catch {
    throw new Error('Error clearing user warnings')
  }
}

module.exports = {
  getUserWarns,
  saveUserWarn,
  deleteWarnById,
  clearUserWarns,
}
