const { Schema, model } = require('mongoose');

const tokenSchema = new Schema({
  address: { type: String, required: true },
  name: { type: String, required: true },
  symbol: { type: String, required: true }
});

module.exports = model('Token', tokenSchema);