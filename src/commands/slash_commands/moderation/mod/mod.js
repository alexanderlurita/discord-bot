const { SlashCommandBuilder } = require('discord.js')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('mod')
    .setDescription('Commands to moderate users')
    .setDMPermission(false)
    .addSubcommand((subcommand) =>
      subcommand
        .setName('clear')
        .setDescription('Delete a quantity of messages in a channel')
        .addIntegerOption((option) =>
          option
            .setName('quantity')
            .setDescription('Number of messages to delete')
            .setMinValue(1)
            .setMaxValue(99)
            .setRequired(true),
        )
        .addUserOption((option) =>
          option
            .setName('user')
            .setDescription('User to be affected')
            .setRequired(false),
        ),
    ),
}
