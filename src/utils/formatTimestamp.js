function formatTimestamps(timestamp) {
  const timestampInSeconds = parseInt(timestamp / 1000)
  const formattedDate = `<t:${timestampInSeconds}:f>`
  const relativeTime = `<t:${timestampInSeconds}:R>`

  return { formattedDate, relativeTime }
}

module.exports = { formatTimestamps }
