const { PermissionFlagsBits, bold } = require('discord.js')
const { errorMessages } = require('../../../../constants/errorMessages')

module.exports = {
  subCommand: 'role.remove',
  async execute(interaction) {
    const member = interaction.options.getMember('member')
    const role = interaction.options.getRole('role')

    if (!interaction.member.permissions.has(PermissionFlagsBits.ManageRoles)) {
      return await interaction.reply({
        content: `${errorMessages.insufficientPermissions}\nRequiere: \`MANAGE_ROLES\``,
        ephemeral: true,
      })
    }

    if (
      !interaction.guild.members.me.permissions.has(
        PermissionFlagsBits.ManageRoles,
      )
    ) {
      return await interaction.reply({
        content: `${errorMessages.botInsufficientPermissions}\nRequiere: \`MANAGE_ROLES\``,
        ephemeral: true,
      })
    }

    if (!member) {
      return await interaction.reply({
        content: errorMessages.userNotInServer,
        ephemeral: true,
      })
    }

    if (role.id === interaction.guild.roles.everyone.id) {
      return await interaction.reply({
        content: errorMessages.everyoneRole,
        ephemeral: true,
      })
    }

    const hasRole = member.roles.cache.has(role.id)

    if (!hasRole) {
      return interaction.reply({
        content: 'El usuario no tiene ese rol',
        ephemeral: true,
      })
    }

    if (role.managed) {
      return interaction.reply({
        content: errorMessages.adminRoleManaged(bold(role.name)),
        ephemeral: true,
      })
    }

    const botRolePosition = interaction.guild.members.me.roles.highest.position

    if (role.rawPosition > botRolePosition) {
      return interaction.reply({
        content: errorMessages.superiorRole('quitar'),
        ephemeral: true,
      })
    }

    await member.roles.remove(role)

    await interaction.reply(
      `Removido ${bold(role.name)} a ${bold(
        member.user.globalName ?? member.user.username,
      )}`,
    )
  },
}
