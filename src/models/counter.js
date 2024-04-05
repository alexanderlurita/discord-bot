const { Schema, model } = require('mongoose')

const CounterSchema = new Schema({
  guildId: { type: String, required: true, unique: true },
  channelIds: { type: [String], required: true },
})

const CounterModel = model('Counter', CounterSchema)

module.exports = { CounterModel }
