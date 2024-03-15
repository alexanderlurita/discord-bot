const { PermissionFlagsBits, bold } = require('discord.js')
const { errorMessages } = require('../../../../constants/errorMessages')
const { saveUserWarn } = require('../../../../controllers/warn')

async function handleWarn({ interaction, member, reason, warnData }) {
  try {
    const savedUserWarnEntry = await saveUserWarn({
      guildId: interaction.guild.id,
      userId: member.user.id,
      warnData,
    })

    if (savedUserWarnEntry) {
      await interaction.reply(
        `${bold(member.user.username)} ha sido advertido.\n${bold(
          'Razón:',
        )} ${reason}`,
      )
    }
  } catch {
    await interaction.reply(
      'Ocurrió un problema al intentar advertir al usuario.',
    )
  }
}

module.exports = {
  subCommand: 'mod.warn',
  async execute(interaction, client) {
    const member = interaction.options.getMember('member')
    const reason = interaction.options.getString('reason') ?? 'No reason given'

    if (!interaction.member.permissions.has(PermissionFlagsBits.ManageRoles)) {
      return await interaction.reply({
        content: `${errorMessages.insufficientPermissions}\nRequiere: \`MANAGE_ROLES\``,
        ephemeral: true,
      })
    }

    if (!member) {
      return await interaction.reply({
        content: errorMessages.userNotInServer,
        ephemeral: true,
      })
    }

    if (member.user.id === interaction.user.id) {
      return await interaction.reply({
        content: errorMessages.cannotSelfAction('advertirte'),
        ephemeral: true,
      })
    }

    if (member.user.id === client.user.id) {
      return await interaction.reply({
        content: errorMessages.cannotUseAgainst,
        ephemeral: true,
      })
    }

    if (member.user.bot) {
      return await interaction.reply({
        content: errorMessages.cannotPerformActionOnBot('advertir'),
        ephemeral: true,
      })
    }

    if (member.permissions.has(PermissionFlagsBits.Administrator)) {
      return await interaction.reply({
        content: errorMessages.adminUserCannot,
        ephemeral: true,
      })
    }

    const warnData = {
      moderatorId: interaction.user.id,
      moderatorUsername: interaction.user.username,
      reason,
    }

    if (interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
      return handleWarn({ interaction, member, reason, warnData })
    }

    const memberRolePosition = member.roles.highest.position
    const executorRolePosition = interaction.member.roles.highest.position

    const onlyEveryoneRole =
      member.roles.cache.size === 1 &&
      member.roles.cache.has(interaction.guild.roles.everyone.id) &&
      interaction.member.roles.cache.size === 1 &&
      interaction.member.roles.cache.has(interaction.guild.roles.everyone.id)

    if (!onlyEveryoneRole && memberRolePosition >= executorRolePosition) {
      return await interaction.reply({
        content: errorMessages.cannotPerformRoleAction('advertir'),
        ephemeral: true,
      })
    }

    handleWarn({ interaction, member, reason, warnData })
  },
}
