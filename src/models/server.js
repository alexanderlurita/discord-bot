const { Schema, model } = require('mongoose')

const WelcomeSchema = new Schema({
  enabled: { type: Boolean, required: true, default: false },
  channelId: { type: String, required: false },
  imageUrl: { type: String, required: false },
  message: { type: String, required: false },
})

const ServerSchema = new Schema({
  guildId: { type: String, required: true, unique: true },
  welcome: { type: WelcomeSchema, required: false },
})

const ServerModel = model('Server', ServerSchema)

module.exports = { ServerModel }
