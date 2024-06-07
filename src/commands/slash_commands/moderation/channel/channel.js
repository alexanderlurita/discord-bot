const { SlashCommandBuilder } = require('discord.js')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('channel')
    .setDescription('Manage channel settings.')
    .setDMPermission(false)
    .addSubcommand((subcommand) =>
      subcommand.setName('lock').setDescription('Lock the current channel'),
    )
    .addSubcommand((subcommand) =>
      subcommand.setName('unlock').setDescription('Unlock the current channel'),
    ),
}
