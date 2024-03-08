const { PermissionFlagsBits, bold } = require('discord.js')
const { errorMessages } = require('../../../../constants/errorMessages')

module.exports = {
  subCommand: 'role.add',
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

    if (hasRole) {
      return await interaction.reply({
        content: 'El usuario ya tiene ese rol',
        ephemeral: true,
      })
    }

    if (role.managed) {
      return await interaction.reply({
        content: errorMessages.adminRoleManaged(bold(role.name)),
        ephemeral: true,
      })
    }

    const botRolePosition = interaction.guild.members.me.roles.highest.position

    if (role.rawPosition > botRolePosition) {
      return await interaction.reply({
        content: errorMessages.superiorRole('agregar'),
        ephemeral: true,
      })
    }

    await member.roles.add(role)

    await interaction.reply(
      `Agregado ${bold(role.name)} a ${bold(
        member.user.globalName ?? member.user.username,
      )}`,
    )
  },
}
