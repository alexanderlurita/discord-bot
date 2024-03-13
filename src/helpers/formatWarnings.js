const { blockQuote, bold, inlineCode, time } = require('discord.js')

function formatWarnings({ user, warnings }) {
  return warnings
    .slice()
    .reverse()
    .map((warn) => {
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
    })
}

module.exports = { formatWarnings }
