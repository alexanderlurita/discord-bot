const { Colors, EmbedBuilder, WebhookClient } = require('discord.js')
const { inspect } = require('node:util')
const { WEBHOOK_URL } = require('../config')

const webhook = new WebhookClient({ url: WEBHOOK_URL })

const embed = new EmbedBuilder().setColor(Colors.Red)

function sendErrorEmbed(embed) {
  webhook.send({ embeds: [embed] })
}

function handleErrors(client) {
  client.on('error', (err) => {
    console.error(err)

    embed
      .setTitle('Discord API Error')
      .setURL('https://discordjs.guide/popular-topics/errors.html#api-errors')
      .setDescription(
        `\`\`\`${inspect(err, { depth: 0 }).slice(0, 1000)}\`\`\``,
      )
      .spliceFields(0, 25)
      .setTimestamp()

    sendErrorEmbed(embed)
  })

  process.on('unhandledRejection', (reason, promise) => {
    console.error(reason, '\n', promise)

    embed
      .setTitle('Unhandled Rejection/Catch')
      .setURL('https://nodejs.org/api/process.html#event-unhandledrejection')
      .spliceFields(0, 25)
      .addFields(
        {
          name: 'Reason',
          value: `\`\`\`${inspect(reason, { depth: 0 }).slice(0, 1000)}\`\`\``,
        },
        {
          name: 'Promise',
          value: `\`\`\`${inspect(promise, { depth: 0 }).slice(0, 1000)}\`\`\``,
        },
      )
      .setTimestamp()

    sendErrorEmbed(embed)
  })

  process.on('uncaughtException', (err, origin) => {
    console.log(err, '\n', origin)

    embed
      .setTitle('Uncaught Exception')
      .setURL('https://nodejs.org/api/process.html#event-uncaughtexception')
      .spliceFields(0, 25)
      .addFields(
        {
          name: 'Error',
          value: `\`\`\`${inspect(err, { depth: 0 }).slice(0, 1000)}\`\`\``,
        },
        {
          name: 'Origin',
          value: `\`\`\`${inspect(origin, { depth: 0 }).slice(0, 1000)}\`\`\``,
        },
      )
      .setTimestamp()

    sendErrorEmbed(embed)
  })

  process.on('uncaughtExceptionMonitor', (err, origin) => {
    console.log(err, '\n', origin)

    embed
      .setTitle('Uncaught Exception Monitor')
      .setURL(
        'https://nodejs.org/api/process.html#event-uncaughtexceptionmonitor',
      )
      .spliceFields(0, 25)
      .addFields(
        {
          name: 'Error',
          value: `\`\`\`${inspect(err, { depth: 0 }).slice(0, 1000)}\`\`\``,
        },
        {
          name: 'Origin',
          value: `\`\`\`${inspect(origin, { depth: 0 }).slice(0, 1000)}\`\`\``,
        },
      )
      .setTimestamp()

    sendErrorEmbed(embed)
  })

  process.on('warning', (warn) => {
    console.log(warn)

    embed
      .setTitle('Uncaught Exception Monitor Warning')
      .setURL('https://nodejs.org/api/process.html#event-warning')
      .spliceFields(0, 25)
      .addFields({
        name: 'Warning',
        value: `\`\`\`${inspect(warn, { depth: 0 }).slice(0, 1000)}\`\`\``,
      })
      .setTimestamp()

    sendErrorEmbed(embed)
  })
}

module.exports = { handleErrors }
