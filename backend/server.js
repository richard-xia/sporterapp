const path = require('path')
const express = require('express')
const dotenv = require('dotenv')
const morgan = require('morgan')
const connectDB = require('./config/db')
const errorHandler = require('./middleware/error')
const cookieParser = require('cookie-parser')
const cors = require('cors')

const groups = require('./routes/groupRoutes')
const games = require('./routes/gameRoutes')
const users = require('./routes/userRoutes')
const auth = require('./routes/auth')
const uploadRoutes = require('./routes/uploadRoutes')

dotenv.config({ path: './config/config.env' })

// Connect to the mongoDB using the options in config/db.js
connectDB()

const app = express()
app.use(express.json())
app.use(cors())
app.use(cookieParser())

// Join the uploads folder to the upload routes
app.use('/uploads', express.static(path.join(__dirname, '../uploads')))

//Add urls for the routes
app.use('/api/v1/groups', groups)
app.use('/api/v1/games', games)
app.use('/api/v1/users', users)
app.use('/api/v1/auth', auth)
app.use('/api/v1/upload', uploadRoutes)

//Use morgan for console logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'))
}

// Join the build folder for deploying the app to Heroku
if (process.env.NODE_ENV === 'production') {
  app.use(
    '/static',
    express.static(path.join(__dirname, '../frontend/build/static'))
  )
  app.get('*', (req, res) =>
    res.sendFile(
      path.resolve(__dirname, '..', 'frontend', 'build', 'index.html')
    )
  )
}

app.use(errorHandler)

// Specify the port of the backend server and create the server
const PORT = process.env.PORT || 5000

const server = app.listen(
  PORT,
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
)

process.on('unhandledRejection', (error, promise) => {
  console.log(`Error: ${error.message}`)
  server.close(() => process.exit(1))
})
