const { PermissionFlagsBits } = require('discord.js')
const { errorMessages } = require('../../../../constants/errorMessages')

async function handleBan({ interaction, user, member, reason }) {
  try {
    if (!member) {
      await interaction.guild.members.ban(user, { reason })
      await interaction.reply(
        `${user.toString()} ha sido baneado\nRazón: ${reason}`,
      )
      return
    }

    if (member.bannable) {
      await member.ban({ reason })
      await interaction.reply(
        `${member.toString()} ha sido baneado\nRazón: ${reason}`,
      )
      return
    }

    await interaction.reply({
      content: 'No es posible banear al usuario',
      ephemeral: true,
    })
  } catch (err) {
    console.error(err)
    await interaction.reply('Ocurrió un error al intentar banear al usuario')
  }
}

module.exports = {
  subCommand: 'mod.ban',
  async execute(interaction, client) {
    const user = interaction.options.getUser('user')
    const reason = interaction.options.getString('reason') ?? 'No reason given'

    if (!interaction.member.permissions.has(PermissionFlagsBits.BanMembers)) {
      return await interaction.reply({
        content: `${errorMessages.insufficientPermissions}.\nRequiere: \`BAN_MEMBERS\``,
        ephemeral: true,
      })
    }

    if (!interaction.member.permissions.has(PermissionFlagsBits.BanMembers)) {
      return await interaction.reply({
        content: `${errorMessages.botInsufficientPermissions}.\nRequiere: \`BAN_MEMBERS\``,
        ephemeral: true,
      })
    }

    const bannedList = await interaction.guild.bans.fetch()
    const bannedUser = bannedList.get(user.id)

    if (bannedUser) {
      return await interaction.reply({
        content: 'El usuario ya está baneado',
        ephemeral: true,
      })
    }

    const memberList = await interaction.guild.members.fetch()
    const member = memberList.get(user.id)

    if (member) {
      if (member.user.id === interaction.user.id) {
        return interaction.reply({
          content: 'No puedes banearte a ti mismo',
          ephemeral: true,
        })
      }

      if (member.user.id === client.user.id) {
        return interaction.reply({
          content: 'No puedes usar eso contra mí',
          ephemeral: true,
        })
      }

      if (member.permissions.has(PermissionFlagsBits.Administrator)) {
        return await interaction.reply({
          content: 'El usuario es administrador, no puedo hacer eso',
          ephemeral: true,
        })
      }

      if (
        interaction.member.permissions.has(PermissionFlagsBits.Administrator)
      ) {
        return handleBan({ interaction, member, reason })
      }

      const memberRolePosition = member.roles.highest.position
      const executorRolePosition = interaction.member.roles.highest.position
      const botRolePosition =
        interaction.guild.members.me.roles.highest.position

      const onlyEveryoneRole =
        member.roles.cache.size === 1 &&
        member.roles.cache.has(interaction.guild.roles.everyone.id) &&
        interaction.member.roles.cache.size === 1 &&
        interaction.member.roles.cache.has(interaction.guild.roles.everyone.id)

      if (!onlyEveryoneRole && memberRolePosition >= executorRolePosition) {
        return await interaction.reply({
          content:
            'No puedes banear al usuario porque tiene un rango igual/superior al tuyo',
          ephemeral: true,
        })
      }

      if (memberRolePosition >= botRolePosition) {
        return await interaction.reply({
          content:
            'No puedo banear al usuario porque tiene un rango igual/superior al mío',
          ephemeral: true,
        })
      }
    }

    handleBan({ interaction, user, reason })
  },
}
