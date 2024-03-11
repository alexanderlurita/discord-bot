const {
  EmbedBuilder,
  PermissionFlagsBits,
  bold,
  blockQuote,
  inlineCode,
  time,
} = require('discord.js')

const { errorMessages } = require('../../../../constants/errorMessages')
const { getUserWarningsFromGuild } = require('../../../../controllers/warn')
const { colors } = require('../../../../constants/colors')

module.exports = {
  subCommand: 'mod.listwarn',
  async execute(interaction) {
    const user = interaction.options.getUser('user')

    if (!interaction.member.permissions.has(PermissionFlagsBits.ManageRoles)) {
      return await interaction.reply({
        content: `${errorMessages.insufficientPermissions}\nRequiere: \`MANAGE_ROLES\``,
        ephemeral: true,
      })
    }

    const userWarnings = await getUserWarningsFromGuild({
      guildId: interaction.guild.id,
      userId: user.id,
    })

    if (!userWarnings) {
      return await interaction.reply({
        content: `${bold(user.username)} no tiene advertencias.`,
        ephemeral: true,
      })
    }

    const listWarnings = userWarnings.warnings
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

    const embedBuilder = new EmbedBuilder()
      .setColor(colors.warning)
      .setAuthor({
        name: user.username,
        iconURL: user.displayAvatarURL({ dynamic: true }),
      })
      .setDescription(
        `Este usuario ha recibido ${bold(listWarnings.length)} advertencia(s).`,
      )
      .setFields(listWarnings)

    await interaction.reply({ embeds: [embedBuilder] })
  },
}
