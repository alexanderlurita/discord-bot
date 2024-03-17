const { blockQuote, bold, inlineCode, time } = require('discord.js')
const hd = require('humanize-duration')

function formatSimpleWarning({ warn }) {
  const timeAgo = Date.now() - warn.createdAt
  const timeFormat = hd(timeAgo, { language: 'es', round: true, largest: 1 })

  return {
    reason: `${warn.reason} (hace ${timeFormat})`,
    value: warn._id,
  }
}

function formatSimpleWarningsList({ warnings }) {
  return warnings
    .slice()
    .reverse()
    .map((warn) => formatSimpleWarning({ warn }))
}

function formatDetailedWarning({ user, warn }) {
  const formattedDate = time(parseInt(warn.createdAt / 1000), 'f')
  const formattedRelativeDate = time(parseInt(warn.createdAt / 1000), 'R')

  const warningDetails = [
    `${bold('Usuario:')} ${user.username} (${inlineCode(user.id)})`,
    `${bold('Razón:')} ${warn.reason}`,
    `${bold('Moderador:')} ${warn.moderatorUsername} (${inlineCode(
      warn.moderatorId,
    )})`,
    `${bold('Fecha:')} ${formattedDate} (${formattedRelativeDate})`,
  ].join('\n')

  return {
    name: `ID: ${warn._id}`,
    value: blockQuote(warningDetails),
  }
}

function formatDetailedWarningsList({ user, warnings }) {
  return warnings
    .slice()
    .reverse()
    .map((warn) => formatDetailedWarning({ user, warn }))
}

module.exports = {
  formatSimpleWarningsList,
  formatDetailedWarningsList,
  formatDetailedWarning,
}
