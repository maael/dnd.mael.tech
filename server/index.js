const express = require('express')
const bodyParser = require('body-parser')
const compression = require('compression')
const next = require('next')

const {PORT, NODE_ENV} = process.env
const port = parseInt(PORT, 10)
const dev = NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

app.prepare().then(() => {
  const api = require('./api')
  const server = express()
    .use(compression())
    .use(bodyParser.json({
      limit: '50mb'
    }))
    .use('/api', api)

  server.get('*', (req, res) => {
    return handle(req, res)
  })

  server.listen(port, err => {
    if (err) throw err
    console.log(`> Ready on http://localhost:${port}`)
  })
})
