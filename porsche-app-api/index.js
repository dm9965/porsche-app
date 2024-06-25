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

var os = require('os');
var networkInterfaces = os.networkInterfaces();
//console.log(networkInterfaces);
Object.values(require("os").networkInterfaces())
.flat()
.filter(({ family, internal }) => family === "IPv4" && !internal)
.map(({ address }) => address)
//console.log(this.address);


require('dotenv').config({ path: "./.env" })
//console.log(process.env)

//if (NODE_ENV === 'production') 
//{
//  host = '199.250.194.87' 
//} else {
//  host = process.env.MYHOST
//}


const pool = require('mysql')
//global.pool = pool.createConnection ({
global.pool = pool.createPool ({
  user: String(process.env.MYUSER),
  host: '199.250.194.87',
  database: process.env.MYDATABASE,
  password: String(process.env.MYPASSWORD),
  port: process.env.MYPORT,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
})

// IP address of database at InMotion
// host: '199.250.194.87',
// database on Dev PC
// host: 'localhost',



//console.log(global.pool)


//console.log(global.pool)
//console.log('host=', process.env.MYHOST)

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
