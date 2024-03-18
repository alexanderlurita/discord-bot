const { blockQuote, bold, inlineCode, userMention } = require('discord.js')

function formatDetailedBansList({ bans }) {
  return bans.slice().map((ban) => {
    const banDetails = [
      `${bold('Mención:')} ${userMention(ban.user.id)}`,
      `${bold('Usuario:')} ${ban.user.username} (${inlineCode(ban.user.id)})`,
      `${bold('Razón:')} ${ban.reason}`,
    ].join('\n')

    return {
      name: `${ban.user.username}`,
      value: blockQuote(banDetails),
    }
  })
}

module.exports = { formatDetailedBansList }
