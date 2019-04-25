
require('dotenv').config();

const knex = require('knex');
const app = require('./app');
const { PORT, DB_URL } = require('./config');

const db = knex({
  client: 'pg',
  connection: DB_URL,
});

app.set('db', db);

//io testing stuff
const server = require('http').Server(app);
const io = require('socket.io')(server);


io.on('connection', function(socket) {
  console.log('connected!');
  socket.on('chat message', function(msg) {
    console.log('Message:'+ msg);
    io.emit('chat message', msg);
  });
  socket.on('disconnect', function() {
    console.log('disconnected!');
  });
});

server.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`);
});