const { statusList } = require('../constants/status')
const { getRandomFromArray } = require('../utils/random')

function updatePresence(client, interval = 10000) {
  client.user.setStatus('idle')

  setInterval(() => {
    const status = getRandomFromArray(statusList)
    client.user.setActivity(status.name, { type: status.type })
  }, interval)
}

module.exports = { updatePresence }
