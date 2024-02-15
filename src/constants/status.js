const { ActivityType } = require('discord.js')

const statusList = [
  { name: 'Brawl Stars', type: ActivityType.Playing },
  { name: 'Clash Royale', type: ActivityType.Playing },
  { name: 'Discord.js', type: ActivityType.Watching },
]

module.exports = { statusList }
