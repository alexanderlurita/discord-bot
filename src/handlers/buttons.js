const { loadFiles } = require('../utils/loadFiles')

async function loadButtons(client) {
  await client.buttons.clear()

  const files = await loadFiles('./src/components/buttons')

  files.forEach((file) => {
    const button = require(file)
    client.buttons.set(button.name, button)
  })

  return console.log('Buttons loaded.')
}

module.exports = { loadButtons }
