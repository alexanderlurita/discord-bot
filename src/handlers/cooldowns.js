function trackCooldowns({ interaction, commandType, commandOrSubcommand }) {
  const { cooldowns } = interaction.client
  const commandName =
    commandType === 'subCommand'
      ? commandOrSubcommand.subCommand
      : commandOrSubcommand.data.name

  const userId = interaction.user.id

  if (!commandOrSubcommand.cooldown) return { onCooldown: false }

  if (!cooldowns.has(commandName)) {
    cooldowns.set(commandName, new Map())
  }

  const now = Date.now()
  const timestamps = cooldowns.get(commandName)
  const defaultCooldownDuration = 0
  const cooldownAmount =
    (commandOrSubcommand.cooldown ?? defaultCooldownDuration) * 1000

  if (timestamps.has(userId)) {
    const expirationTime = timestamps.get(userId) + cooldownAmount

    if (now < expirationTime) {
      const remainingTime = expirationTime - now
      return {
        onCooldown: true,
        remainingTime,
      }
    }
  }

  timestamps.set(userId, now)
  setTimeout(() => timestamps.delete(userId), cooldownAmount)

  return { onCooldown: false }
}

module.exports = { trackCooldowns }
