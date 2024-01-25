const {response} = require("express");

const Pool = require('pg').Pool
//const pool = new Pool ({
 // user: String(process.env.USER),
 // host: process.env.HOST,
 // database: process.env.DATABASE,
 // password: process.env.PASSWORD,
 // port: process.env.PORT
//})
const pool = new Pool ({
  user: "nrpca",
  host: "localhost",
  database: "nrpcadb",
  password: "porsche911",
  port: 5432
})

const getUsers = (request, response) => {
  pool.query('SELECT * FROM users', (error, results) => {
    if (error) {
      throw error;
    }
    response.status(200).json(results.rows)
  })
}

const getEvents = (request, response) => {
  pool.query("SELECT *, '1' as startday, '2' as endday FROM event_list ORDER BY startdatetime", (error, results) => {
    if (error) {
      throw error;
    }
    response.status(200).json(results.rows)
  })
}

const getFutureEvents = (request, response) => {
  pool.query("SELECT *, '1' as startday, '2' as endday FROM event_list WHERE startdatetime >= NOW() ORDER BY startdatetime", (error, results) => {
    if (error) {
      throw error;
    }
    response.status(200).json(results.rows)
  })
}


const getPastEvents = (request, response) => {
  pool.query("SELECT *, '1' as startday, '2' as endday FROM event_list WHERE startdatetime < NOW() ORDER BY startdatetime DESC", (error, results) => {
    if (error) {
      throw error;
    }
    response.status(200).json(results.rows)
  })
}


const createUser = (request, response) => {
  const {email, username, password} = request.body

  pool.query('INSERT INTO users (email, username, password) VALUES($1, $2, $3)',
    [email, username, password], (error, results) => {
    if (error) {
      throw error;
    }
    response.status(201).send(`User added with user id: ${results.insertId}`)
    })
}

const createEvent = (request, response) => {
  const {startdatetime, enddatetime, eventname, location, details} = request.body;

  pool.query(
    'INSERT INTO event_list (startdatetime, enddatetime, eventname, location, details) VALUES ($1, $2, $3, $4, $5)',
    [startdatetime, enddatetime, eventname, location, details], (error, results) => {
      if (error) {
        throw error;
      }
      response.status(201).send(results)
    }
  )
}

const selectEvent = (request, response) => {
  eventid = request.query.id;
  //console.log("query=" + request.query);
  //console.log("query.id=" + request.query.id);
  //console.log("eventid=" + request.query.id);
  pool.query (
    'SELECT * FROM event_list WHERE id = $1' ,
    [eventid],
    (error, results) => {
      if (error) {
        throw error;
      }
      response.status(201).json(results.rows)
    }
  )
}


const rsvpEvent = (request, response) => {
  const {id, attending} = request.body;
  pool.query (
    'UPDATE event_list SET attending = attending + $1 WHERE id = $2',
    [attending, id],
    (error, results) => {
      if (error) {
        throw error;
      }
      response.status(201).send(results)
    }
  )
}

const cancel = (request, response) => {
  const {id, attending} = request.body;
  pool.query (
    'UPDATE event_list SET attending = attending - $1 WHERE id = $2',
    [attending, id],
    (error, results) => {
      if (error) {
        throw error;
      }
      response.status(201).send(results)
    }
  )
}

const updateEvent = (request, response) => {
  const {id, startdatetime, enddatetime, eventname, location, details} = request.body;
  pool.query (
    'UPDATE event_list SET startdatetime = $1, enddatetime = $2, eventname = $3, location = $4, details = $5 WHERE id = $6',
    [startdatetime, enddatetime, eventname, location, details, id],
    (error, results) => {
      if (error) {
        throw error;
      }
      response.status(201).send(results)
    }
  )
}


const deleteEvent = (request, response) => {
  const {id} = request.body;
  pool.query (
    'DELETE FROM event_list WHERE id = $1',
    [id],
    (error, result) => {
      if (error) {
        throw error;
      }
      response.status(201).send(result)
    }
  )
}

const getImages = (request, response) => {
  pool.query (
    'SELECT * FROM images',
    (error, results) => {
      if (error) {
        throw error
      }
      return response.status(201).send(results)
    }
  )
}

const addImage = (request, response) => {
  const {imageURL} = request.body;
  pool.query (
    'INSERT INTO images (imageURL) VALUES ($1)',
    [imageURL],
    (error, results) => {
      if (error) {
        throw error;
      }
      return response.status(201).send(results)
    }
  )
}

module.exports = {
  getUsers,
  getEvents,
  getFutureEvents,
  getPastEvents,
  createUser,
  createEvent,
  rsvpEvent,
  updateEvent,
  deleteEvent,
  selectEvent,
  cancel,
  getImages,
  addImage
}
