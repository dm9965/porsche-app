const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors');
const app = express()
const port = 3001

const db = require('./queries')

//app.use(cors());
const corsOptions = {
  origin: true, //"https://nrpcaevents.org/events/totals",  //(https://your-client-app.com)
  methods: ['GET', 'PUT', 'POST', 'DELETE'],
  preflightContinue: false,
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

require('dotenv').config({ path: "./.env" })
//console.log(process.env)

const pool = require('mysql')
global.pool = pool.createConnection ({
  user: String(process.env.MYUSER),
  host: process.env.MYHOST,
  database: process.env.MYDATABASE,
  password: String(process.env.MYPASSWORD),
  port: process.env.MYPORT,
  waitForConnections: true,
  connectionLimit: 1,
  queueLimit: 0
})

//console.log(global.pool)

app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({
    extended: true
  })
)

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Internal Server Error');
});

app.get('/', (request, response) => {
  response.json({
    info: 'Node.js, express, and MySQL api',
    throw : Error('BROKEN') // Express will catch this on its own.
  })
})

app.listen(port, () => {
  console.log(`App running on ${port}`)
})


app.get('/users/all', db.getUsers)
app.get('/events/all', db.getEvents)
app.get('/events/future', db.getFutureEvents)
app.get('/events/past', db.getPastEvents)
app.get('/events/totals', db.getEventTotals)
app.post('/users/create', db.createUser)
app.post('/users/login', db.loginUser)
app.post('/event/create', db.createEvent)
app.put('/event/attend', db.rsvpEvent)
app.put('/event/update', db.updateEvent)
app.delete('/event/delete', db.deleteEvent)
app.get('/event/select', db.selectEvent)
app.put('/event/cancel', db.cancel)
app.get('/images/all', db.getImages)
app.post('/images/add', db.addImage)
