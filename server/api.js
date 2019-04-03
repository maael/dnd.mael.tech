const router = require('express').Router()
const mongoose = require('mongoose')
const debounce = require('lodash.debounce')
const Map = require('./models/Map')
const MapSave = require('./models/MapSave')

const {MONGO_URI} = process.env

console.info('connecting to', MONGO_URI)

const db = mongoose.connection;
const mongooseOptions = {auto_reconnect: true, reconnectInterval: 10000, useNewUrlParser: true};

db.on('connecting', () => {
  console.log('connecting to MongoDB...');
});
db.on('error', (error) => {
  console.error('Error in MongoDb connection: ' + error);
  mongoose.disconnect();
});
db.on('connected', () => {
  console.log('MongoDB connected!');
});
db.once('open', () => {
  console.log('MongoDB connection opened!');
});
db.on('reconnected', () => {
  console.log('MongoDB reconnected!');
});
db.on('disconnected', debounce(() => {
  console.log('MongoDB disconnected!');
  mongoose.connect(MONGO_URI, mongooseOptions);
}, mongooseOptions.reconnectInterval, {leading: true}));

const conn = mongoose.connect(MONGO_URI, mongooseOptions)

router.get('/map', async (_, res) => {
  const items = await Map.find({})
  res.send({items})
})

router.post('/map', async (req, res) => {
  const item = new Map(req.body)
  await item.save()
  res.send({item})
})

router.get('/map-save', async (_, res) => {
  const items = await MapSave.find({})
  res.send({items})
})

router.get('/map-save/:id', async (req, res) => {
  const {id} = req.params
  const item = await MapSave.findById(id)
  res.send(item)
})

router.patch('/map-save/:id', async (req, res) => {
  const {id} = req.params;
  await MapSave.updateOne({_id: id}, req.body);
  const item = await MapSave.findById(id)
  res.send(item)
})

router.post('/map-save', async (req, res) => {
  const savedItem = await MapSave.create(req.body);
  res.send(savedItem)
})

module.exports = router;
