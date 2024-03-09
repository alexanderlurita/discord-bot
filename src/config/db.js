require('dotenv').config()

const username = process.env.MONGO_USERNAME
const password = process.env.MONGO_PASSWORD
const cluster = process.env.MONGO_CLUSTER
const database = process.env.MONGO_DATABASE

const mongoURI = `mongodb+srv://${username}:${password}@${cluster}/${database}?retryWrites=true&w=majority`

module.exports = { mongoURI }
