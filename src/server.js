
require('dotenv').config();

const knex = require('knex');
const app = require('./app');
const { PORT, DB_URL } = require('./config');
const server = require('./io');

const db = knex({
  client: 'pg',
  connection: DB_URL,
});

app.set('db', db);

server.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`);
});
