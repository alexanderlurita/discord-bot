const { bold } = require('discord.js')
const { getRandomInteger } = require('../../../../utils/random')

module.exports = {
  subCommand: 'game.roll',
  async execute(interaction) {
    const min = interaction.options.getInteger('min') ?? 1
    const max = interaction.options.getInteger('max') ?? 100

    if (min > max) {
      return await interaction.reply({
        content: 'El valor mínimo debe ser menor que el valor máximo.',
        ephemeral: true,
      })
    }

    const randomNumber = getRandomInteger(min, max)

    await interaction.reply(
      `${bold(
        interaction.user.globalName ?? interaction.user.username,
      )} ha tirado un dado de (${bold(max)}) y ha obtenido un ${bold(
        randomNumber,
      )}.`,
    )
  },
}
