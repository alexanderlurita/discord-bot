function paginateArray({ array, itemsPerPage }) {
  if (!Array.isArray(array)) {
    throw new Error("The 'array' property must be an array.")
  }

  if (!Number.isInteger(itemsPerPage) || itemsPerPage <= 0) {
    throw new Error("The 'itemsPerPage' property must be a positive integer.")
  }

  const pages = []
  for (let i = 0; i < array.length; i += itemsPerPage) {
    pages.push(array.slice(i, i + itemsPerPage))
  }

  return pages
}

module.exports = { paginateArray }
