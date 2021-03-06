const PORT = process.env.PORT || 3000
const BASE_URL = process.env.BASE_URL || ('http://localhost:' + PORT)
const ROOT_DIR = __dirname
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/grabsikel'
const SESSION_SECRET = process.env.SESSION_SECRET || '88c2f98ec676d7c66eaa5f91f47f6924'
const COOKIE_SECRET = process.env.COOKIE_SECRET || '5d136bc0b286fb8c9099f703245f5e34'
const JWT_SECRET = process.env.JWT_SECRET || 'ac703c366668bcf1427d4230db8273a5'
const ORS_SECRET = process.env.ORS_SECRET || '5b3ce3597851110001cf6248efd0fd8dbe8d4815a7e654e6127ab1a2'

module.exports = {
  PORT,
  BASE_URL,
  ROOT_DIR,
  MONGODB_URI,
  SESSION_SECRET,
  COOKIE_SECRET,
  JWT_SECRET,
  ORS_SECRET
}