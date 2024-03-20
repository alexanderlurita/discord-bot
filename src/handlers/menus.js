const { loadFiles } = require('../utils/loadFiles')

async function loadMenus(client) {
  await client.menus.clear()

  const files = await loadFiles('./src/components/menus')

  files.forEach((file) => {
    const menu = require(file)
    client.menus.set(menu.name, menu)
  })

  return console.log('Menus loaded.')
}

module.exports = { loadMenus }
