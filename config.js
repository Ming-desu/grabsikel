const PORT = process.env.PORT || 80
const BASE_URL = process.env.BASE_URL || ('localhost' + PORT)
const ROOT_DIR = __dirname
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/grabsikel'

module.exports = {
  PORT,
  BASE_URL,
  ROOT_DIR,
  MONGODB_URI
}