const { statusList } = require('../constants/status')
const { getRandom } = require('../utils/getRandom')

function updatePresence(client, interval = 10000) {
  client.user.setStatus('idle')

  setInterval(() => {
    const status = getRandom(statusList)
    client.user.setActivity(status.name, { type: status.type })
  }, interval)
}

module.exports = { updatePresence }
