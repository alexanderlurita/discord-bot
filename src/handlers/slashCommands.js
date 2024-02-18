const Ascii = require('ascii-table')
const { loadFiles } = require('../utils/loadFiles')

const table = new Ascii().setHeading('Slash Commands', 'Status')

async function loadSlashCommands(client) {
  await client.commands.clear()
  await client.subCommands.clear()

  const commandsList = []

  const files = await loadFiles('./src/commands/slash_commands')

  files.forEach((file) => {
    const command = require(file)

    if (command.subCommand) {
      client.subCommands.set(command.subCommand, command)
      table.addRow(command.subCommand, '🟩')
      return
    }

    client.commands.set(command.data.name, command)

    commandsList.push(command.data.toJSON())

    table.addRow(command.data.name, '🟩')
  })

  client.application.commands.set(commandsList)

  return console.log(table.toString(), '\nSlash commands loaded.')
}

module.exports = { loadSlashCommands }
