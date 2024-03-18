const {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ComponentType,
  EmbedBuilder,
  PermissionFlagsBits,
  bold,
} = require('discord.js')
const { errorMessages } = require('../../../../constants/errorMessages')
const { colors } = require('../../../../constants/colors')
const { paginateArray } = require('../../../../utils/pagination')
const { formatDetailedBansList } = require('../../../../helpers/formatBans')

const ITEMS_PER_PAGE = 5
const BUTTONS_TIMEOUT = 90_000

function handleCollector({ reply, embed, controls, pages, interaction }) {
  let pageIndex = 0
  const collectorFilter = (i) => i.user.id === interaction.user.id

  const collector = reply.createMessageComponentCollector({
    componentType: ComponentType.Button,
    filter: collectorFilter,
    time: BUTTONS_TIMEOUT,
  })

  collector.on('collect', async (i) => {
    if (i.customId === 'back') {
      pageIndex = Math.max(0, pageIndex - 1)
    }

    if (i.customId === 'next') {
      pageIndex = Math.min(pages.length - 1, pageIndex + 1)
    }

    embed.spliceFields(0, ITEMS_PER_PAGE).addFields(pages[pageIndex])

    controls.components[1].setLabel(`${pageIndex + 1}/${pages.length}`)
    controls.components[0].setDisabled(pageIndex === 0)
    controls.components[2].setDisabled(pageIndex === pages.length - 1)

    await i.update({ embeds: [embed], components: [controls] })
  })

  collector.on('end', async () => {
    controls.components.forEach((control) => control.setDisabled(true))
    await reply.edit({ components: [controls] })
  })
}

module.exports = {
  subCommand: 'mod.listban',
  async execute(interaction) {
    if (
      !interaction.guild.members.me.permissions.has(
        PermissionFlagsBits.BanMembers,
      )
    ) {
      return await interaction.editReply({
        content: `${errorMessages.botInsufficientPermissions}\nRequiere: \`BAN_MEMBERS\``,
        ephemeral: true,
      })
    }

    const bannedList = await interaction.guild.bans.fetch()

    if (!bannedList.size) {
      return await interaction.reply(
        `No hay usuarios baneados en este servidor.`,
      )
    }

    const formattedBans = formatDetailedBansList({
      bans: Array.from(bannedList.values()),
    })

    const pages = paginateArray({
      array: formattedBans,
      itemsPerPage: ITEMS_PER_PAGE,
    })

    const embed = new EmbedBuilder()
      .setColor(colors.warning)
      .setAuthor({
        name: interaction.guild.name,
        iconURL: interaction.guild.iconURL({ dynamic: true }),
      })
      .setDescription(
        `Hay ${bold(bannedList.size)} usuario(s) baneado(s) en este servidor.`,
      )
      .setFields(pages[0])

    let controls = null
    if (formattedBans.length > ITEMS_PER_PAGE) {
      controls = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId('back')
          .setEmoji('◀')
          .setStyle(ButtonStyle.Primary)
          .setDisabled(true),

        new ButtonBuilder()
          .setCustomId('pages')
          .setLabel(`1/${pages.length}`)
          .setStyle(ButtonStyle.Secondary)
          .setDisabled(true),

        new ButtonBuilder()
          .setCustomId('next')
          .setEmoji('▶')
          .setStyle(ButtonStyle.Primary),
      )
    }

    const reply = await interaction.reply({
      embeds: [embed],
      components: controls ? [controls] : [],
    })

    if (controls) {
      handleCollector({
        reply,
        embed,
        controls,
        pages,
        interaction,
      })
    }
  },
}
