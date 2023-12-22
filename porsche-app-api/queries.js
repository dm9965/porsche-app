const {response} = require("express");

const Pool = require('pg').Pool
const pool = new Pool ({
  user: String(process.env.USER),
  host: process.env.HOST,
  database: process.env.DATABASE,
  password: String(process.env.PASSWORD),
  port: process.env.PORT
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
  pool.query('SELECT * FROM event_list', (error, results) => {
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
      response.status(201).send(`Event created with event id: ${results.insertId}`)
    }
  )
}

module.exports = {
  getUsers,
  getEvents,
  createUser,
  createEvent
}
