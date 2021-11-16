// import express
const express = require('express')
const { urlencoded, json } = require('express')

// import packages
const cors = require('cors')
const helmet = require('helmet')
const morgan = require('morgan')
const mongoose = require('mongoose')

// import routes
const useRoute = require('./routes')

// import dotenv
const dotenv = require('dotenv')
dotenv.config()

// start app express
const app = express();

// adding Helmet to enhance API's security
app.use(helmet());

// parse the incoming requests with JSON payloads
app.use(urlencoded({extended: true}))
app.use(json()) 

// enabling CORS for all requests
app.use(cors())

// adding morgan to log HTTP requests
app.use(morgan('combined'))


// use router 
useRoute(app)

// connect to mongodb database
mongoose.connect(
    process.env.DB_CONNECTION, 
    { 
      useNewUrlParser: true, 
      useUnifiedTopology: true 
    }
  )
  .then(
    () => console.log('Connected to MongoDB successfully !!!'),
    err => console.log('Connect to MongoDB error:', err)
  ) 

// starting the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.warn(`App listening on http://localhost:${PORT}`)
});






