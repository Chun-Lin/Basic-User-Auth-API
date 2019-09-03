const express = require('express')
const bodyParser = require('body-parser')

const app = express()

// to parse the body info
app.use(bodyParser.json())

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
  ){

    res.json('Successfully log in')
  }else {
    res.status(404).json('error logging in')
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
