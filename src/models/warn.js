const { Schema, model } = require('mongoose')

const WarnEntrySchema = new Schema({
  moderatorId: { type: String, required: true },
  moderatorUsername: { type: String, required: true },
  reason: { type: String, default: 'No reason given' },
  createdAt: { type: Number, default: Date.now },
})

const WarnSchema = new Schema({
  userId: { type: String, required: true },
  guildId: { type: String, required: true },
  warnings: { type: [WarnEntrySchema], required: true },
})

const WarnModel = model('Warn', WarnSchema)

module.exports = { WarnModel }
