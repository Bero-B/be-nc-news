const { Pool } = require('pg');
const ENV = process.env.NODE_ENV || 'development';

const config = {};
if (ENV === 'production'){
  config.connectionString = process.env.DATABASE_URL
  config.max = 2
}
require('dotenv').config({
  path: `${__dirname}/../.env.${ENV}`,
});

console.log(`the database is ${process.env.PGDATABASE}`)
console.log(`the ENV is ${ENV}`)

if (!process.env.PGDATABASE && !process.env.DATABASE_URL) {
  throw new Error('PGDATABASE or DATABASE_URL not set');
}

module.exports = new Pool(config);
