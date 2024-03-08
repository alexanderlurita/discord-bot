const { SlashCommandBuilder } = require('discord.js')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('role')
    .setDescription('Commands to moderate user roles')
    .setDMPermission(false)
    .addSubcommand((subcommand) =>
      subcommand
        .setName('add')
        .setDescription('Add a role to a specific member')
        .addUserOption((option) =>
          option
            .setName('member')
            .setDescription('Member to add role to')
            .setRequired(true),
        )
        .addRoleOption((option) =>
          option
            .setName('role')
            .setDescription('Role to add')
            .setRequired(true),
        ),
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName('remove')
        .setDescription('Remove a role from a specific member')
        .addUserOption((option) =>
          option
            .setName('member')
            .setDescription('Member to remove role from')
            .setRequired(true),
        )
        .addRoleOption((option) =>
          option
            .setName('role')
            .setDescription('Role to remove')
            .setRequired(true),
        ),
    ),
}
