function getRandomFromArray(array = []) {
  if (!Array.isArray(array)) throw new Error('Expected an array as parameter.')

  if (!array.length) throw new Error('The provided array is empty.')

  const randomIndex = Math.floor(Math.random() * array.length)

  return array[randomIndex]
}

function getRandomInteger(min = 1, max = 10) {
  if (!Number.isInteger(min) || !Number.isInteger(max)) {
    throw new Error('Parameters must be integers.')
  }

  return Math.floor(Math.random() * (max - min + 1)) + min
}

module.exports = { getRandomFromArray, getRandomInteger }
