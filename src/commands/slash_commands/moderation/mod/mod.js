const { SlashCommandBuilder } = require('discord.js')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('mod')
    .setDescription('Commands to moderate users')
    .setDMPermission(false)
    .addSubcommand((subcommand) =>
      subcommand
        .setName('ban')
        .setDescription('Ban a user')
        .addUserOption((option) =>
          option
            .setName('user')
            .setDescription('User to ban')
            .setRequired(true),
        )
        .addStringOption((option) =>
          option
            .setName('reason')
            .setDescription('Reason for the ban')
            .setRequired(false),
        ),
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName('clear')
        .setDescription('Delete a quantity of messages in a channel')
        .addIntegerOption((option) =>
          option
            .setName('quantity')
            .setDescription('Number of messages to delete')
            .setMinValue(1)
            .setMaxValue(100)
            .setRequired(true),
        )
        .addUserOption((option) =>
          option
            .setName('user')
            .setDescription('User to be affected')
            .setRequired(false),
        ),
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName('clearwarns')
        .setDescription('Clears all warnings of a member')
        .addUserOption((option) =>
          option
            .setName('member')
            .setDescription('Member whose warnings will be cleared')
            .setRequired(true),
        ),
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName('kick')
        .setDescription('Kick out a member')
        .addUserOption((option) =>
          option
            .setName('member')
            .setDescription('Member to kick out')
            .setRequired(true),
        )
        .addStringOption((option) =>
          option
            .setName('reason')
            .setDescription('Reason for kick out')
            .setRequired(false),
        ),
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName('listban')
        .setDescription('Show all banned users from the server'),
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName('listwarn')
        .setDescription('Show all warnings for a user')
        .addUserOption((option) =>
          option
            .setName('user')
            .setDescription('User to see their list of warns')
            .setRequired(true),
        ),
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName('snipe')
        .setDescription(
          'Snipe the last deleted message from the current channel',
        ),
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName('softban')
        .setDescription(
          'Bans and then unbans a member to remove 7 days of messages',
        )
        .addUserOption((option) =>
          option
            .setName('member')
            .setDescription('Member to softban')
            .setRequired(true),
        )
        .addStringOption((option) =>
          option
            .setName('reason')
            .setDescription('Reason for the softban')
            .setRequired(false),
        ),
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName('timeout')
        .setDescription('Timeout a member')
        .addUserOption((option) =>
          option
            .setName('member')
            .setDescription('Member to timeout')
            .setRequired(true),
        )
        .addStringOption((option) =>
          option
            .setName('duration')
            .setDescription('Duration of timeout (format: 1m | 2h | 3d)')
            .setRequired(false),
        )
        .addStringOption((option) =>
          option
            .setName('reason')
            .setDescription('Reason for timeout')
            .setRequired(false),
        ),
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName('unban')
        .setDescription('Remove the ban from a user')
        .addStringOption((option) =>
          option
            .setName('user')
            .setDescription('User to unban (Username or User ID)')
            .setMinLength(2)
            .setMaxLength(32)
            .setRequired(true),
        )
        .addStringOption((option) =>
          option
            .setName('reason')
            .setDescription('Reason for the unban')
            .setRequired(false),
        ),
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName('untimeout')
        .setDescription('Removes timeout from a member')
        .addUserOption((option) =>
          option
            .setName('member')
            .setDescription('Member to remove timeout')
            .setRequired(true),
        )
        .addStringOption((option) =>
          option
            .setName('reason')
            .setDescription('Reason for removing timeout')
            .setRequired(false),
        ),
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName('unwarn')
        .setDescription('Remove a warning from a member')
        .addUserOption((option) =>
          option
            .setName('member')
            .setDescription('Member to be unwarned')
            .setRequired(true),
        )
        .addStringOption((option) =>
          option
            .setName('warn')
            .setDescription('Warn to remove')
            .setAutocomplete(true)
            .setRequired(true),
        ),
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName('warn')
        .setDescription('Warn a member')
        .addUserOption((option) =>
          option
            .setName('member')
            .setDescription('Member to be warned')
            .setRequired(true),
        )
        .addStringOption((option) =>
          option
            .setName('reason')
            .setDescription('Reason for the warning')
            .setRequired(false),
        ),
    ),
}
