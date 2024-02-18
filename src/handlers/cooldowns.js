function trackCooldowns(interaction, command) {
  const { cooldowns } = interaction.client
  const { name } = command.data
  const userId = interaction.user.id

  if (!command.cooldown) return { onCooldown: false }

  if (!cooldowns.has(name)) {
    cooldowns.set(name, new Map())
  }

  const now = Date.now()
  const timestamps = cooldowns.get(name)
  const defaultCooldownDuration = 0
  const cooldownAmount = (command.cooldown ?? defaultCooldownDuration) * 1000

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
