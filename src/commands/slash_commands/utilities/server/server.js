const { SlashCommandBuilder } = require('discord.js')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('server')
    .setDescription('Commands to obtain information from the server')
    .setDMPermission(false)
    .addSubcommand((subcommand) =>
      subcommand.setName('icon').setDescription("Shows the server's icon"),
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName('info')
        .setDescription('Shows detailed information about the server'),
    ),
}
