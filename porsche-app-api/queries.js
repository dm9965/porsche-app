const {response} = require("express");

const getUsers = (request, response) => {
  pool.query('SELECT * FROM users', (error, results) => {
    if (error) {
      console.log('error in query: ', error)  //logs to server, not browser console
      console.log(request)
      //throw error;
      response.status(500).json(error)
    }
    response.status(200).json(results)
  })
}

const getEvents = (request, response) => {
  pool.query("SELECT *, '1' as startday, '2' as endday, '0' as errorflag FROM event_list WHERE startdatetime > DATE_SUB(CURDATE(), INTERVAL 18 MONTH) ORDER BY startdatetime", 
  (error, results) => {
    if (error) {
      console.log('error in query: ', error)  //logs to server, not browser console
      console.log(request)
      //throw error;
      response.status(500).json(error)
    }
    response.status(200).json(results)
  })
}

const getFutureEvents = (request, response) => {
  pool.query("SELECT *, '1' as startday, '2' as endday, '0' as errorflag FROM event_list WHERE date(startdatetime) >= date(NOW()) ORDER BY startdatetime", 
  (error, results) => {
    if (error) {
      console.log('error in query: ', error)  //logs to server, not browser console
      console.log(request)
      //throw error;
      response.status(500).json(error)
    }
    response.status(200).json(results)
  })
}

const getPastEvents = (request, response) => {
  pool.query("SELECT *, '1' as startday, '2' as endday, '0' as errorflag FROM event_list WHERE startdatetime between DATE_SUB(CURDATE(), INTERVAL 18 MONTH) AND NOW() ORDER BY startdatetime DESC", 
  (error, results) => {
    if (error) {
      console.log('error in query: ', error)  //logs to server, not browser console
      console.log(request)
      //throw error;
      response.status(500).json(error)
    }
    response.status(200).json(results)
  })
}


const getEventTotals = (request, response) => {
  var status = 200
  pool.query("SELECT *, '1' as startday, '2' as endday, '0' as errorflag FROM event_list WHERE startdatetime > DATE_SUB(CURDATE(), INTERVAL 18 MONTH) ORDER BY startdatetime DESC", 
  (error, results) => {
    if (error) {
      console.log('error in query: ', error)  //logs to server, not browser console
      console.log(request)
      //throw error;
      response.status(500).json(error)
    } else {
      response.status(200).json(results)
    }
  })
}


const createUser = (request, response) => {
  const {email, username, password} = request.body

  pool.query('INSERT INTO users (email, username, password) VALUES(?, ?, ?)',
    [email, username, password], (error, results) => {
    if (error) {
      console.log('error in query: ', error)  //logs to server, not browser console
      //throw error;
      response.status(500).json(error)
    }
    response.status(201).send(`User added with user id: ${results.insertId}`)
    })
}

const loginUser = (request, response) => {
  const {email, password} = request.body
  pool.query (
    "SELECT * FROM users WHERE email = (?) AND password = (?)" ,
    [email, password],
    (error, results) => {
      if (error) {
        console.log('error in query: ', error)  //logs to server, not browser console
        //throw error;
        response.status(500).json(error)
        }
      response.status(200).json(results)
    }
  )
}

const createEvent = (request, response) => {
  const {startdatetime, enddatetime, eventname, location, details} = request.body
  pool.query(
    'INSERT INTO event_list (startdatetime, enddatetime, eventname, location, details) VALUES (?,?,?,?,?)',
    [startdatetime, enddatetime, eventname, location, details], 
    (error, results) => {
      if (error) {
        console.log('error in query: ', error)  //logs to server, not browser console
        //throw error;
        response.status(500).json(error)
        }
      response.status(201).send(results)
    }
  )
}

const selectEvent = (request, response) => {
  eventid = request.query.id;
  pool.query (
    "SELECT *, '0' as errorflag FROM event_list WHERE id = (?)" ,
    [eventid],
    (error, results) => {
      if (error) {
        console.log('error in query: ', error)  //logs to server, not browser console
        //throw error;
        response.status(500).json(error)
        }
      response.status(201).json(results)
    }
  )
}


const rsvpEvent = (request, response) => {
  const {id, attending} = request.body;
  pool.query (
    'UPDATE event_list SET attending = attending + (?) WHERE id = (?)',
    [attending, id],
    (error, results) => {
      if (error) {
        console.log('error in query: ', error)  //logs to server, not browser console
        //throw error;
        response.status(500).json(error)
        }
      response.status(201).send(results)
    }
  )
}

const cancel = (request, response) => {
  const {id, attending} = request.body;
  pool.query (
    'UPDATE event_list SET attending = attending - (?) WHERE id = (?)',
    [attending, id],
    (error, results) => {
      if (error) {
        console.log('error in query: ', error)  //logs to server, not browser console
        //throw error;
        response.status(500).json(error)
        }
      response.status(201).send(results)
    }
  )
}

const updateEvent = (request, response) => {
  const {id, startdatetime, enddatetime, eventname, location, details} = request.body;
  pool.query (
    'UPDATE event_list SET startdatetime = (?), enddatetime = (?), eventname = (?), location = (?), details = (?) WHERE id = (?)',
    [startdatetime, enddatetime, eventname, location, details, id],
    (error, results) => {
      if (error) {
        console.log('error in query: ', error)  //logs to server, not browser console
        //throw error;
        response.status(500).json(error)
        }
      response.status(201).send(results)
    }
  )
}


const deleteEvent = (request, response) => {
  const {id} = request.body;
  pool.query (
    'DELETE FROM event_list WHERE id = (?)',
    [id],
    (error, result) => {
      if (error) {
        console.log('error in query: ', error)  //logs to server, not browser console
        //throw error;
        response.status(500).json(error)
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
        console.log('error in query: ', error)  //logs to server, not browser console
        //throw error;
        response.status(500).json(error)
        }
      return response.status(201).json(results)
    }
  )
}

const addImage = (request, response) => {
  const {imageURL} = request.body;
  pool.query (
    'INSERT INTO images (imageURL) VALUES (?)',
    [imageURL],
    (error, results) => {
      if (error) {
        console.log('error in query: ', error)  //logs to server, not browser console
        //throw error;
        response.status(500).json(error)
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
  getEventTotals,
  createUser,
  loginUser,
  createEvent,
  rsvpEvent,
  updateEvent,
  deleteEvent,
  selectEvent,
  cancel,
  getImages,
  addImage
}
