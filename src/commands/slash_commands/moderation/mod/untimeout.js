const { PermissionFlagsBits, bold } = require('discord.js')
const { errorMessages } = require('../../../../constants/errorMessages')

async function handleUntimeout({ interaction, member, reason }) {
  try {
    if (member.isCommunicationDisabled()) {
      await member.timeout(null, reason)
      await interaction.reply(
        `El aislamiento de ${bold(member.user.globalName)} ha sido removido`,
      )
    } else {
      return interaction.reply(
        `${bold(member.user.globalName)} no se encuentra aislado`,
      )
    }
  } catch (err) {
    console.error(err)
    await interaction.reply('Ocurrió un error al intentar desaislar al usuario')
  }
}

module.exports = {
  subCommand: 'mod.untimeout',
  async execute(interaction, client) {
    const member = interaction.options.getMember('member')
    const reason = interaction.options.getString('reason') ?? 'No reason given'

    if (
      !interaction.member.permissions.has(PermissionFlagsBits.ModerateMembers)
    ) {
      return await interaction.reply({
        content: `${errorMessages.insufficientPermissions}\nRequiere: \`MODERATE_MEMBERS\``,
        ephemeral: true,
      })
    }

    if (
      !interaction.guild.members.me.permissions.has(
        PermissionFlagsBits.ModerateMembers,
      )
    ) {
      return await interaction.reply({
        content: `${errorMessages.botInsufficientPermissions}\nRequiere: \`MODERATE_MEMBERS\``,
        ephemeral: true,
      })
    }

    if (!member) {
      return await interaction.reply({
        content: errorMessages.userNotInServer,
        ephemeral: true,
      })
    }

    if (member.user.id === interaction.user.id) {
      return await interaction.reply({
        content: errorMessages.cannotSelfAction('desaislarte'),
        ephemeral: true,
      })
    }

    if (member.user.id === client.user.id) {
      return await interaction.reply({
        content: errorMessages.cannotUseAgainst,
        ephemeral: true,
      })
    }

    if (member.user.bot) {
      return await interaction.reply({
        content: errorMessages.cannotPerformActionOnBot('desaislar'),
        ephemeral: true,
      })
    }

    if (member.permissions.has(PermissionFlagsBits.Administrator)) {
      return await interaction.reply({
        content: errorMessages.adminUserCannot,
        ephemeral: true,
      })
    }

    if (interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
      return handleUntimeout({ interaction, member, reason })
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
        content: errorMessages.cannotPerformRoleAction('desaislar'),
        ephemeral: true,
      })
    }

    if (memberRolePosition >= botRolePosition) {
      return await interaction.reply({
        content: errorMessages.cannotPerformRoleActionByBot('desaislar'),
        ephemeral: true,
      })
    }

    handleUntimeout({ interaction, member, reason })
  },
}
