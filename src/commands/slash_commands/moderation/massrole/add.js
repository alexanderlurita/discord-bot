const {
  EmbedBuilder,
  PermissionFlagsBits,
  bold,
  roleMention,
} = require('discord.js')
const { errorMessages } = require('../../../../constants/errorMessages')

module.exports = {
  subCommand: 'massrole.add',
  async execute(interaction) {
    const role = interaction.options.getRole('role')
    const requiredRole = interaction.options.getRole('required_role')

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

    if (role.id === interaction.guild.roles.everyone.id) {
      return await interaction.reply({
        content: errorMessages.everyoneRole,
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

    const { guild } = interaction

    await interaction.reply('Procesando, esto puede tardar unos minutos...')

    const members = await guild.members.fetch()
    let addedCount = 0

    for (const member of members.values()) {
      if (requiredRole && !member.roles.cache.has(requiredRole.id)) {
        continue
      }

      if (!member.roles.cache.has(role.id)) {
        try {
          await member.roles.add(role)
          addedCount++
        } catch (err) {
          console.log(err)
        }
      }

      await new Promise((resolve) => setTimeout(resolve, 200))
    }

    const embed = new EmbedBuilder()
      .setTitle('Rol agregado')
      .setDescription(
        `Se ha agregado el rol ${roleMention(
          role.id,
        )} a ${addedCount} miembros.`,
      )
      .setColor('Green')

    await interaction.editReply({ content: '', embeds: [embed] })
  },
}
