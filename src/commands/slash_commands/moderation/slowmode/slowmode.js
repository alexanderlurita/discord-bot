const { ChannelType, SlashCommandBuilder } = require('discord.js')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('slowmode')
    .setDescription('Commands to configure slowmode on channels')
    .setDMPermission(false)
    .addSubcommand((subcommand) =>
      subcommand
        .setName('set')
        .setDescription('Enable slowmode on a channel')
        .addChannelOption((option) =>
          option
            .setName('channel')
            .setDescription('The channel where slowmode will be enabled')
            .addChannelTypes(
              ChannelType.GuildText,
              ChannelType.GuildVoice,
              ChannelType.GuildAnnouncement,
            )
            .setRequired(true),
        )
        .addStringOption((option) =>
          option
            .setName('time')
            .setDescription('The time to set for slowmode channel')
            .setRequired(true),
        ),
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName('unset')
        .setDescription('Disable slowmode on a channel')
        .addChannelOption((option) =>
          option
            .setName('channel')
            .setDescription('The channel to remove slowmode from')
            .addChannelTypes(
              ChannelType.GuildText,
              ChannelType.GuildVoice,
              ChannelType.GuildAnnouncement,
            )
            .setRequired(true),
        ),
    ),
}
