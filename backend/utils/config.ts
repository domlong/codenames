import path from 'path';
import * as dotenv from 'dotenv';
dotenv.config({ path: path.resolve(__dirname, '../.env.development.local') });

const PORT = process.env.PORT || 8080;
const MONGODB_URI = process.env.MONGODB_URI;

export default {
  MONGODB_URI,
  PORT
};