const path = require('path')
require('dotenv').config({ path: path.resolve(__dirname, '../.env.development.local') })

const PORT = process.env.PORT || 8080
const MONGODB_URI = process.env.MONGODB_URI

module.exports = {
  MONGODB_URI,
  PORT
}