const { PermissionFlagsBits } = require('discord.js')
const ms = require('ms')
const hd = require('humanize-duration')

const { errorMessages } = require('../../../../constants/errorMessages')
const { hdOptions } = require('../../../../config/hd')

async function handleTimeout({ interaction, member, duration, reason }) {
  const msDuration = ms(duration)

  if (isNaN(msDuration)) {
    return await interaction.reply({
      content: 'Por favor escriba una duración válida',
      ephemeral: true,
    })
  }

  if (msDuration < 5000 || msDuration > 2.419e9) {
    return await interaction.reply({
      content: 'La duración no puede ser menor a 5 segundos o mayor a 28 días',
      ephemeral: true,
    })
  }

  const formattedDuration = hd(msDuration, hdOptions)

  try {
    if (member.isCommunicationDisabled()) {
      await member.timeout(msDuration, reason)
      await interaction.reply(
        `El aislamiento de **${member.user.globalName}** ha sido actualizado a **${formattedDuration}**\nRazón: ${reason}`,
      )
      return
    }

    await member.timeout(msDuration, reason)
    await interaction.reply(
      `**${member.user.globalName}** ha sido aislado por **${formattedDuration}**\nRazón: ${reason}`,
    )
  } catch (err) {
    console.error(err)
    await interaction.reply('Ocurrió un error al intentar aislar al usuario')
  }
}

module.exports = {
  subCommand: 'mod.timeout',
  async execute(interaction, client) {
    const member = interaction.options.getMember('member')
    const duration = interaction.options.getString('duration') ?? '5m'
    const reason = interaction.options.getString('reason') ?? 'No reason given'

    if (
      !interaction.member.permissions.has(PermissionFlagsBits.ModerateMembers)
    ) {
      return await interaction.reply({
        content: `${errorMessages.insufficientPermissions}.\nRequiere: \`MODERATE_MEMBERS\``,
        ephemeral: true,
      })
    }

    if (
      !interaction.guild.members.me.permissions.has(
        PermissionFlagsBits.ModerateMembers,
      )
    ) {
      return await interaction.reply({
        content: `${errorMessages.botInsufficientPermissions}.\nRequiere: \`MODERATE_MEMBERS\``,
        ephemeral: true,
      })
    }

    if (!member) {
      return await interaction.reply({
        content: 'El usuario no existe en este servidor',
        ephemeral: true,
      })
    }

    if (member.user.id === interaction.user.id) {
      return await interaction.reply({
        content: 'No puedes aislarte a ti mismo',
        ephemeral: true,
      })
    }

    if (member.user.id === client.user.id) {
      return await interaction.reply({
        content: 'No puedes usar eso contra mí',
        ephemeral: true,
      })
    }

    if (member.user.bot) {
      return await interaction.reply({
        content: 'No puedes aislar a un bot',
        ephemeral: true,
      })
    }

    if (member.permissions.has(PermissionFlagsBits.Administrator)) {
      return await interaction.reply({
        content: 'El usuario es administrador, no puedo hacer eso',
        ephemeral: true,
      })
    }

    if (interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
      return handleTimeout({ interaction, member, duration, reason })
    }

    const memberRolePosition = member.roles.highest.position
    const executorRolePosition = interaction.member.roles.highest.position
    const botRolePosition = interaction.guild.members.me.roles.highest.position

    const onlyEveryoneRole =
      member.roles.cache.size === 1 &&
      member.roles.cache.has(interaction.guild.roles.everyone.id) &&
      interaction.member.roles.cache.size === 1 &&
      interaction.member.roles.cache.has(interaction.guild.roles.everyone.id)

    if (!onlyEveryoneRole && memberRolePosition >= executorRolePosition) {
      return await interaction.reply({
        content:
          'No puedes aislar al usuario porque tiene un rango igual/superior al tuyo',
        ephemeral: true,
      })
    }

    if (memberRolePosition >= botRolePosition) {
      return await interaction.reply({
        content:
          'No puedo aislar al usuario porque tiene un rango igual/superior al mío',
        ephemeral: true,
      })
    }

    handleTimeout({ interaction, member, duration, reason })
  },
}
