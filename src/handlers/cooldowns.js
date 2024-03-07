function trackCooldowns({ interaction, commandCategory, commandData }) {
  const { cooldowns } = interaction.client
  const serverId = interaction.guild.id
  const commandName =
    commandCategory === 'subCommand'
      ? commandData.subCommand
      : commandData.data.name

  const userId = interaction.user.id

  if (!commandData.cooldown) return { onCooldown: false }

  if (!cooldowns.has(serverId)) {
    cooldowns.set(serverId, new Map())
  }

  const serverCooldowns = cooldowns.get(serverId)

  if (!serverCooldowns.has(commandName)) {
    serverCooldowns.set(commandName, new Map())
  }

  const commandCooldowns = serverCooldowns.get(commandName)

  const now = Date.now()
  const defaultCooldownDuration = 0
  const cooldownAmount =
    (commandData.cooldown ?? defaultCooldownDuration) * 1000

  if (commandCooldowns.has(userId)) {
    const expirationTime = commandCooldowns.get(userId) + cooldownAmount

    if (now < expirationTime) {
      const remainingTime = expirationTime - now
      return {
        onCooldown: true,
        remainingTime,
      }
    }
  }

  commandCooldowns.set(userId, now)
  setTimeout(() => commandCooldowns.delete(userId), cooldownAmount)

  return { onCooldown: false }
}

module.exports = { trackCooldowns }
