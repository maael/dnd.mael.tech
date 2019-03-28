const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ModelSchema = new Schema({
  name: 'string',
})

const Model = mongoose.model('Map', ModelSchema);

module.exports = Model
