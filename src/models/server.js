const { Schema, model } = require('mongoose')

const ServerSchema = new Schema({
  guildId: { type: String, required: true, unique: true },
  welcomeChannel: { type: String, required: false },
})

const ServerModel = model('Server', ServerSchema)

module.exports = { ServerModel }
