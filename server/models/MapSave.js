const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ModelSchema = new Schema({
  name: 'string',
  description: 'string',
  data: {type: 'object'}
}, {
  timestamps: true,
  id: false
})

const Model = mongoose.model('MapSave', ModelSchema);

module.exports = Model
