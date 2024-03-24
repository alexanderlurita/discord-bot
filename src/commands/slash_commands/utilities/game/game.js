const { SlashCommandBuilder } = require('discord.js')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('game')
    .setDescription('Commands to play mini-games')
    .setDMPermission(false)
    .addSubcommand((option) =>
      option
        .setName('roll')
        .setDescription(
          'Roll the die and return a value within the range of two numbers',
        )
        .addIntegerOption((option) =>
          option
            .setName('min')
            .setDescription('Minimum value (Default is 1)')
            .setMinValue(1)
            .setMaxValue(1000)
            .setRequired(false),
        )
        .addIntegerOption((option) =>
          option
            .setName('max')
            .setDescription('Maximum value (Default is 100)')
            .setMinValue(1)
            .setMaxValue(1000)
            .setRequired(false),
        ),
    ),
}
