const express = require('express')
const session = require('express-session')
const cookieParser = require('cookie-parser')
const app = express()

const axios = require('axios')
const twig = require('twig')

const { 
  COOKIE_SECRET, 
  PORT, 
  BASE_URL
} = require('./config')

axios.defaults.baseURL = BASE_URL

// Require connection to the database
require('./src/utils/database')

require('./src/utils/twig')(twig);

app.set('view engine', 'twig')

app.set('twig options', {
  allow_sync: true,
  strict_variables: false
})

// Use express session middleware
app.use(session({
  resave: false,
  saveUninitialized: false,
  secret: COOKIE_SECRET
}))

// Create a custom error handler in session
app.response.message = function(message, type = 'notification') {
  const session = this.req.session || []
  
  session.messages = session.messages || []
  session.messages.push({
    body: message,
    type
  })

  return this
}

// Expose custom functions to the view
app.use((req, res, next) => {
  const messages = req.session.messages || []

  res.locals.messages = messages
  res.locals.hasMessage = messages.length > 0

  res.locals.getMessage = () => {
    if (messages.length <= 0) {
      return
    }

    req.session.messages = []
    return messages[0]
  }

  res.locals.path = req.path;
  res.locals.originalUrl = req.originalUrl;

  next()
})

app.use(cookieParser())

app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))
app.use(express.json({ limit: '10mb' }))

// Admin Routes
app.use('/admin', require('./src/routes/pages/admin/index.route'))

// Client Routes

// Driver Routes

// API Routes
app.use('/api', require('./src/routes/api/api.route'))

app.get('/', (req, res) => res.send('Hello World'))

app.listen(PORT, () => console.log(`${BASE_URL}`))