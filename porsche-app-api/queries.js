const {response} = require("express");
const Pool = require('pg').Pool
const pool = new Pool ({
  user: 'domenicmangano',
  host: 'localhost',
  database: 'porsche_club',
  password: 'SofiaPenny22!',
  port: 5432,
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

module.exports = {
  getUsers,
  getEvents
}
