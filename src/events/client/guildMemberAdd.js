const { Events, bold, userMention } = require('discord.js')
const { getServerConfig } = require('../../controllers/server')

module.exports = {
  name: Events.GuildMemberAdd,
  async execute(interaction) {
    const { user, guild } = interaction

    const serverConfig = await getServerConfig({ guildId: guild.id })
    if (!serverConfig?.welcome?.enabled) return

    if (!serverConfig?.welcome?.channelId) return

    const { channelId } = serverConfig.welcome

    const channel = guild.channels.cache.get(channelId)
    if (!channel) return

    await channel.send({
      content: `Bienvenido ${userMention(user.id)} a ${bold(
        guild.name,
      )}! Espero que te diviertas :)`,
    })
  },
}
