const { SlashCommandBuilder } = require('discord.js')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('user')
    .setDescription('Commands to obtain information from a user')
    .setDMPermission(false)
    .addSubcommand((subcommand) =>
      subcommand
        .setName('avatar')
        .setDescription("Shows a user's avatar")
        .addUserOption((option) =>
          option
            .setName('user')
            .setDescription('User to view their avatar')
            .setRequired(false),
        ),
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName('banner')
        .setDescription("Shows a user's banner")
        .addUserOption((option) =>
          option
            .setName('user')
            .setDescription('User to view their banner')
            .setRequired(false),
        ),
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName('info')
        .setDescription('Shows detailed information about a user')
        .addUserOption((option) =>
          option
            .setName('user')
            .setDescription('User to view their information')
            .setRequired(false),
        ),
    ),
}
