const fs = require('fs')
const mongoose = require('mongoose')
const dotenv = require('dotenv')

dotenv.config({ path: './config/config.env' })

const Group = require('./models/groupModel')
const Game = require('./models/gameModel')
const User = require('./models/userModel')

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
})

// Parse sample data from the _data folder
const groups = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/groups.json`, 'utf-8')
)

const games = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/games.json`, 'utf-8')
)

const users = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/users.json`, 'utf-8')
)

// Function for importing data
const importData = async () => {
  try {
    await Group.create(groups)
    await Game.create(games)
    await User.create(users)

    console.log('Data Imported...')
    process.exit()
  } catch (error) {
    console.error(error)
  }
}

// Function for deleting all data
const deleteData = async () => {
  try {
    await Group.deleteMany()
    await Game.deleteMany()
    await User.deleteMany()

    console.log('Data Destroyed...')
    process.exit()
  } catch (error) {
    console.error(error)
  }
}

// Command line arguments for running the seeder
if (process.argv[2] === '-i') {
  importData()
} else if (process.argv[2] === '-d') {
  deleteData()
}
