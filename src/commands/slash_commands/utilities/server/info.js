const {
  ActionRowBuilder,
  StringSelectMenuBuilder,
  StringSelectMenuOptionBuilder,
} = require('discord.js')
const { createButton } = require('../../../../helpers/buttons')
const { buildGuildInfoEmbed } = require('../../../../helpers/guildTools')

module.exports = {
  subCommand: 'server.info',
  async execute(interaction, client) {
    const { guild } = interaction

    const embedBuilder = await buildGuildInfoEmbed({ guild, client })

    const stringSelectMenuRow = new ActionRowBuilder().addComponents(
      new StringSelectMenuBuilder()
        .setCustomId('change-server-info')
        .addOptions(
          new StringSelectMenuOptionBuilder()
            .setLabel('Servidor')
            .setDescription('Muestra información general del servidor')
            .setEmoji('🏘️')
            .setValue('info')
            .setDefault(true),
          new StringSelectMenuOptionBuilder()
            .setLabel('Roles')
            .setDescription('Muestra los roles del servidor')
            .setEmoji('👑')
            .setValue('roles'),
          new StringSelectMenuOptionBuilder()
            .setLabel('Emojis')
            .setDescription('Muestra los emojis del servidor')
            .setEmoji('🔎')
            .setValue('emojis'),
        ),
    )

    const buttons = [
      { id: 'show-server-icon', label: 'Ícono', emoji: '🖼️' },
      { id: 'show-server-banner', label: 'Banner', emoji: '🖼️' },
    ]

    const buttonsRow = new ActionRowBuilder().addComponents(
      buttons.map(createButton),
    )

    await interaction.reply({
      embeds: [embedBuilder],
      components: [stringSelectMenuRow, buttonsRow],
    })
  },
}
