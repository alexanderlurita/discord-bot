const {
  PermissionFlagsBits,
  bold,
  inlineCode,
  userMention,
} = require('discord.js')
const { errorMessages } = require('../../../../constants/errorMessages')
const { userIdRegex } = require('../../../../constants/regex')

module.exports = {
  subCommand: 'mod.unban',
  async execute(interaction) {
    const user = interaction.options.getString('user')
    const reason = interaction.options.getString('reason') ?? 'No reason given'

    if (!interaction.member.permissions.has(PermissionFlagsBits.BanMembers)) {
      return interaction.reply({
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
    let bannedUsers

    if (userIdRegex.test(user)) {
      const bannedUser = bannedList.get(user)
      bannedUsers = bannedUser ? [bannedUser] : []
    } else {
      bannedUsers = Array.from(bannedList.values()).filter((banEntry) =>
        banEntry.user.username.includes(user),
      )
    }

    if (bannedUsers.length === 0) {
      return await interaction.reply({
        content: 'El usuario no está baneado',
        ephemeral: true,
      })
    }

    if (bannedUsers.length > 1) {
      const userList = bannedUsers
        .sort((a, b) => a.user.username.localeCompare(b.user.username))
        .map(
          ({ user: { id, username } }) =>
            `${userMention(id)} ${bold(username)} (${inlineCode(id)})`,
        )
        .join('\n')

      return await interaction.reply({
        content: `Se encontraron varias coincidencias para el nombre "${user}":\n${userList}`,
        ephemeral: true,
      })
    }

    const userToUnban = bannedUsers[0].user
    await interaction.guild.members.unban(userToUnban, { reason })

    await interaction.reply(
      `${userMention(userToUnban.id)} ha sido desbaneado\nRazón: ${reason}`,
    )
  },
}
