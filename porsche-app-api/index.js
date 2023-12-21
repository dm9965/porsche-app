const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const port = 3001

const db = require('./queries')

app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({
    extended: true
  })
)

app.get('/', (request, response) => {
  response.json({
    info: 'Node.js, express, and postgres api'
  })
})

app.listen(port, () => {
  console.log(`App running on ${port}`)
})

app.get('/users/all', db.getUsers)
app.get('/events/all', db.getEvents)
