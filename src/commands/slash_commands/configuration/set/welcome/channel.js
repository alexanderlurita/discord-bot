const { PermissionFlagsBits, channelMention } = require('discord.js')

const { errorMessages } = require('../../../../../constants/errorMessages')
const {
  getServerConfig,
  saveServerConfig,
} = require('../../../../../controllers/server')

module.exports = {
  subCommand: 'set.welcome.channel',
  async execute(interaction) {
    const channel = interaction.options.getChannel('channel')

    if (
      !interaction.member.permissions.has(PermissionFlagsBits.Administrator)
    ) {
      return await interaction.reply({
        content: `${errorMessages.insufficientPermissions}\nRequiere: \`ADMINISTRATOR\``,
        ephemeral: true,
      })
    }

    if (!channel) {
      const serverConfig = await getServerConfig({
        guildId: interaction.guild.id,
      })

      const welcomeChannelId = serverConfig?.welcome?.channelId

      if (!welcomeChannelId) {
        return await interaction.reply(
          'No se ha establecido un canal de bienvenidas.',
        )
      }

      const welcomeChannel =
        interaction.guild.channels.cache.get(welcomeChannelId)

      if (!welcomeChannel) {
        return await interaction.reply(
          'No existe un canal de bienvenidas en el servidor.',
        )
      }

      return await interaction.reply(
        `El actual canal de bienvenidas es ${channelMention(
          welcomeChannelId,
        )}.`,
      )
    }

    const serverConfig = await saveServerConfig({
      guildId: interaction.guild.id,
      welcome: { enabled: true, channelId: channel.id },
    })

    if (serverConfig) {
      await interaction.reply(
        `Se estableció ${channelMention(
          channel.id,
        )} como el canal de bienvenidas.`,
      )
    }
  },
}
