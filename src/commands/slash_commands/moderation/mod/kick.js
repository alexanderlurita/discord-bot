const { PermissionFlagsBits } = require('discord.js')
const { errorMessages } = require('../../../../constants/errorMessages')

async function handleKickout({ interaction, member, reason }) {
  try {
    if (member.kickable) {
      await member.kick(reason)
      await interaction.reply(
        `${member.toString()} ha sido expulsado\nRazón: ${reason}`,
      )
      return
    }

    await interaction.reply({
      content: 'No es posible expulsar al usuario',
      ephemeral: true,
    })
  } catch (err) {
    console.error(err)
    await interaction.reply('Ocurrió un error al intentar expulsar al usuario')
  }
}

module.exports = {
  subCommand: 'mod.kick',
  async execute(interaction, client) {
    const member = interaction.options.getMember('member')
    const reason = interaction.options.getString('reason') ?? 'No reason given'

    if (!interaction.member.permissions.has(PermissionFlagsBits.KickMembers)) {
      return await interaction.reply({
        content: `${errorMessages.insufficientPermissions}\nRequiere: \`KICK_MEMBERS\``,
        ephemeral: true,
      })
    }

    if (
      !interaction.guild.members.me.permissions.has(
        PermissionFlagsBits.KickMembers,
      )
    ) {
      return await interaction.reply({
        content: `${errorMessages.botInsufficientPermissions}\nRequiere: \`KICK_MEMBERS\``,
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
        content: errorMessages.cannotSelfAction('expulsarte'),
        ephemeral: true,
      })
    }

    if (member.user.id === client.user.id) {
      return await interaction.reply({
        content: errorMessages.cannotUseAgainst,
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
      return handleKickout({ interaction, member, reason })
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
        content: errorMessages.cannotPerformRoleAction('expulsar'),
        ephemeral: true,
      })
    }

    if (memberRolePosition >= botRolePosition) {
      return await interaction.reply({
        content: errorMessages.cannotPerformRoleActionByBot('expulsar'),
        ephemeral: true,
      })
    }

    handleKickout({ interaction, member, reason })
  },
}
