const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')

const app = express()

// to parse the body info
app.use(bodyParser.json())
app.use(cors())

app.get('/', (req, res) => {
  res.send('this is working')
})

const database = {
  users: [
    {
      id: '123',
      name: 'Gary',
      email: 'gary@gmail.com',
      password: 'monkey',
      entries: 0,
      joined: new Date(),
    },
    {
      id: '234',
      name: 'Amber',
      email: 'amber@gmail.com',
      password: 'monkey2',
      entries: 0,
      joined: new Date(),
    },
  ],
}

app.post('/signin', (req, res) => {
  if (
    req.body.email === database.users[0].email &&
    req.body.password === database.users[0].password
  ) {
    res.json('Successfully log in')
  } else {
    res.status(404).json('error logging in')
  }
})

app.post('/register', (req, res) => {
  const { email, name, password } = req.body

  database.users.push({
    id: '123',
    name: name,
    email: email,
    password: password,
    entries: 0,
    joined: new Date(),
  })

  res.json(database.users[database.users.length - 1])
})

app.get('/profile/:id', (req, res) => {
  const { id } = req.params
  let found = false
  database.users.forEach(user => {
    if (user.id === id) {
      found = true
      return res.json(user) // found it then break the loop and respond json
    }
  })

  if (!found) {
    res.status(400).json('not found')
  }
})

app.put('/image', (req, res) => {
  const { id } = req.params
  let found = false
  database.users.forEach(user => {
    if (user.id === id) {
      found = true
      user.entries++
      return res.json(user.entries) // found it then break the loop and respond json
    }
  })

  if (!found) {
    res.status(400).json('not found')
  }
})

app.listen(3000, () => console.log('app is running on port 3000'))

/*

/ --> res = this is working
/singin --> POST(sending passsword within the body not on the query) = success/fail
/register --> POST = user
/profile/:userId --> GET = user
/image --> PUT(user update their avatar) --> user

*/
