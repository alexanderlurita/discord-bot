const { PermissionFlagsBits } = require('discord.js')

const { errorMessages } = require('../../../../../constants/errorMessages')
const {
  getServerConfig,
  saveServerConfig,
} = require('../../../../../controllers/server')

module.exports = {
  subCommand: 'set.welcome.message',
  async execute(interaction) {
    const content = interaction.options.getString('content')

    if (
      !interaction.member.permissions.has(PermissionFlagsBits.Administrator)
    ) {
      return await interaction.reply({
        content: `${errorMessages.insufficientPermissions}\nRequiere: \`ADMINISTRATOR\``,
        ephemeral: true,
      })
    }

    if (!content) {
      const serverConfig = await getServerConfig({
        guildId: interaction.guild.id,
      })

      const message = serverConfig?.welcome?.message

      if (!message) {
        return await interaction.reply(
          'No se ha establecido un mensaje de bienvenidas.',
        )
      }

      return await interaction.reply(
        `El actual mensaje de bienvenidas es:\n${message}`,
      )
    }

    const serverConfig = await saveServerConfig({
      guildId: interaction.guild.id,
      welcome: { message: content },
    })

    if (serverConfig) {
      await interaction.reply(
        `Se estableció el mensaje de bienvenidas:\n${content}`,
      )
    }
  },
}
