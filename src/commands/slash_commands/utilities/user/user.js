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
            .setDescription('User to see their avatar')
            .setRequired(false),
        ),
    ),
}
