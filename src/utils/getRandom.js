function getRandom(array = []) {
  if (!Array.isArray(array)) throw new Error('Expected an array as parameter.')

  if (!array.length) throw new Error('The provided array is empty.')

  const randomIndex = Math.floor(Math.random() * array.length)

  return array[randomIndex]
}

module.exports = { getRandom }
