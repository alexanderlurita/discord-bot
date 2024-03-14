const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  ChannelType,
} = require('discord.js')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('set')
    .setDescription('Commands to configure events and functions on the server')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .setDMPermission(false)
    .addSubcommandGroup((subcommandGroup) =>
      subcommandGroup
        .setName('welcome')
        .setDescription('Commands to configure welcome messages')
        .addSubcommand((subcommand) =>
          subcommand
            .setName('channel')
            .setDescription('Set the welcome messages channel')
            .addChannelOption((option) =>
              option
                .setName('channel')
                .setDescription('Welcome channel to set')
                .addChannelTypes(ChannelType.GuildText)
                .setRequired(false),
            ),
        )
        .addSubcommand((subcommand) =>
          subcommand
            .setName('message')
            .setDescription('Set the default welcome message content')
            .addStringOption((option) =>
              option
                .setName('content')
                .setDescription('Message content to set')
                .setRequired(false),
            ),
        ),
    ),
}
