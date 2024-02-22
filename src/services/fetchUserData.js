const { DISCORD_API_URL, TOKEN } = require('../config')

async function getUserData({ userId }) {
  const res = await fetch(`${DISCORD_API_URL}/users/${userId}`, {
    headers: { Authorization: `Bot ${TOKEN}` },
  })

  if (!res.ok) {
    throw new Error(
      `Failed to fetch user data: ${res.status} - ${res.statusText}`,
    )
  }

  const json = await res.json()

  return json
}

module.exports = { getUserData }
