const { randomUUID } = require('node:crypto')
const { ButtonBuilder, ButtonStyle } = require('discord.js')

function createButton({
  id = randomUUID(),
  label,
  emoji,
  style = ButtonStyle.Primary,
  disabled = false,
} = {}) {
  const button = new ButtonBuilder()
    .setCustomId(id)
    .setStyle(style)
    .setDisabled(disabled)

  if (!label && !emoji) button.setLabel('Click me!')
  else if (label) button.setLabel(label)

  if (emoji) button.setEmoji(emoji)

  return button
}

function createLinkButton({
  label = 'View in browser',
  url = 'https://www.aprendejavascript.dev/this-is-fine-404.gif',
} = {}) {
  const button = new ButtonBuilder()
    .setLabel(label)
    .setURL(url)
    .setStyle(ButtonStyle.Link)

  return button
}

module.exports = { createButton, createLinkButton }
