const { Events, userMention, bold } = require('discord.js')
const { getServerById } = require('../controllers/server')

module.exports = {
  name: Events.GuildMemberAdd,
  async execute(interaction) {
    const { user, guild } = interaction

    const { welcomeChannel: channelId } = await getServerById({
      guildId: guild.id,
    })
    if (!channelId) return

    const channel = guild.channels.cache.get(channelId)
    if (!channel) return

    await channel.send({
      content: `¡Hola ${userMention(user.id)}! Bienvenido a ${bold(
        guild.name,
      )}, espero que te diviertas :)`,
    })
  },
}
