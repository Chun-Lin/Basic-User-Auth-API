const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const knex = require('knex')
const bcrypt = require('bcrypt')

const db = knex({
  client: 'pg',
  connection: {
    host: '127.0.0.1',
    user: 'chun-linwu',
    password: '',
    database: 'smart-brain',
  },
})

const app = express()

// to parse the body info
app.use(bodyParser.json())
app.use(cors())

app.get('/', (req, res) => {
  res.send('this is working')
})

app.post('/signin', (req, res) => {
  const { email, password } = req.body

  db.select('email', 'hash')
    .from('login')
    .where('email', '=', email)
    .then(data => {
      bcrypt.compare(password, data[0].hash).then(isValid =>
        isValid
          ? db
              .select('*')
              .from('users')
              .where('email', '=', email)
              .then(user => res.json(user[0]))
              .catch(err => res.status(400).json('unable to get the user'))
          : res.status(400).json('wrong credentials'),
      )
    })
    .catch(err => res.status(400).json('wrong credentials1'))
})

app.post('/register', (req, res) => {
  const { email, name, password } = req.body
  const saltRounds = 10
  bcrypt // encryption
    .hash(password, saltRounds)
    .then(hash => {
      // doing transaction between 'login' & 'users' table
      db.transaction(trx => {
        trx('login')
          .insert({
            hash: hash,
            email: email,
          })
          .returning('email')
          .then(loginEmail => {
            return trx('users')
              .insert({
                email: loginEmail[0],
                name: name,
                joined: new Date(),
              })
              .returning('*')
              .then(user => res.json(user[0]))
          })
          .then(trx.commit)
          .catch(trx.rollback)
      }).catch(err => res.status(400).json('unable to register'))
    })
    .catch(err => console.log(err))
})

app.get('/profile/:id', (req, res) => {
  const { id } = req.params

  db.select('*')
    .from('users')
    .where({ id: id })
    .then(user =>
      user.length > 0 ? res.json(user[0]) : res.status(400).json('Not Found'),
    )
    .catch(err => res.status(400).json('error getting user'))
})

app.put('/image', (req, res) => {
  const { id } = req.body
  db('users')
    .where('id', '=', id)
    .increment('entries', 1)
    .returning('entries')
    .then(entries => res.json(entries[0]))
    .catch(err => res.status(400).json('unable to get entries'))
})

app.listen(3000, () => console.log('app is running on port 3000'))

/*

/ --> res = this is working
/singin --> POST(sending passsword within the body not on the query) = success/fail
/register --> POST = user
/profile/:userId --> GET = user
/image --> PUT(user update their avatar) --> user

*/
