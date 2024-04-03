const { PermissionFlagsBits, userMention } = require('discord.js')
const { errorMessages } = require('../../../../constants/errorMessages')

async function handleSoftban({ interaction, member, reason }) {
  try {
    if (member.bannable) {
      await member.ban({ reason, deleteMessageSeconds: 604800 })

      await interaction.guild.members.unban(
        member.user,
        'The ban was a softban',
      )

      await interaction.reply(
        `${userMention(member.user.id)} ha sido softbaneado\nRazón: ${reason}`,
      )
      return
    }

    await interaction.reply({
      content: 'No es posible softbanear al usuario.',
      ephemeral: true,
    })
  } catch (err) {
    console.log(err)
    await interaction.reply(
      'Ocurrió un error al intentar softbanear al usuario.',
    )
  }
}

module.exports = {
  subCommand: 'mod.softban',
  async execute(interaction, client) {
    const member = interaction.options.getMember('member')
    const reason = interaction.options.getString('reason') ?? 'No reason given'

    if (!interaction.member.permissions.has(PermissionFlagsBits.BanMembers)) {
      return await interaction.reply({
        content: `${errorMessages.insufficientPermissions}\nRequiere: \`BAN_MEMBERS\``,
        ephemeral: true,
      })
    }

    if (
      !interaction.guild.members.me.permissions.has(
        PermissionFlagsBits.BanMembers,
      )
    ) {
      return await interaction.reply({
        content: `${errorMessages.botInsufficientPermissions}\nRequiere: \`BAN_MEMBERS\``,
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
        content: errorMessages.cannotSelfAction('softbanearte'),
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
      return handleSoftban({ interaction, member, reason })
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
        content: errorMessages.cannotPerformRoleAction('softbanear'),
        ephemeral: true,
      })
    }

    if (memberRolePosition >= botRolePosition) {
      return await interaction.reply({
        content: errorMessages.cannotPerformRoleActionByBot('softbanear'),
        ephemeral: true,
      })
    }

    handleSoftban({ interaction, member, reason })
  },
}
