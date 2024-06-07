const { SlashCommandBuilder } = require('discord.js')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('massrole')
    .setDescription('Commands to moderate roles for all users')
    .setDMPermission(false)
    .addSubcommand((subcommand) =>
      subcommand
        .setName('add')
        .setDescription('Add a role to all members')
        .addRoleOption((option) =>
          option
            .setName('role')
            .setDescription('Role to add to all')
            .setRequired(true),
        )
        .addRoleOption((option) =>
          option
            .setName('required_role')
            .setDescription('Role required for affected users')
            .setRequired(false),
        ),
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName('remove')
        .setDescription('Remove a role from all members')
        .addRoleOption((option) =>
          option
            .setName('role')
            .setDescription('Role to remove from all')
            .setRequired(true),
        ),
    ),
}
