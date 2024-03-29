const Ascii = require('ascii-table')
const { loadFiles } = require('../utils/loadFiles')

const table = new Ascii().setHeading('Events', 'Status')

function isEventNameInTable(eventName) {
  return table.getRows().some((row) => row[0] === eventName)
}

async function loadEvents(client) {
  await client.events.clear()

  const files = await loadFiles('./src/events')

  files.forEach((file) => {
    const event = require(file)

    const execute = (...args) => event.execute(...args, client)
    client.events.set(event.name, execute)

    if (event.rest) {
      if (event.once) client.rest.once(event.name, execute)
      else client.rest.on(event.name, execute)
    } else {
      if (event.once) client.once(event.name, execute)
      else client.on(event.name, execute)
    }

    if (!isEventNameInTable(event.name)) {
      table.addRow(event.name, '🟩')
    }
  })

  return console.log(table.toString(), '\nEvents loaded.')
}

module.exports = { loadEvents }
