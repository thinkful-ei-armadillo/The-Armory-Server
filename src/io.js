const app = require('./app');
const PartyService = require('../src/party/party-service');
const { requireSocketAuth } = require('../src/middleware/jwt-auth');
//io testing stuff
const server = require('http').Server(app);
const io = require('socket.io')(server);

io.on('connection', function(socket) {
  console.log('connected!');

  socket.on('join game', function(game_id) {
    socket.join(game_id);
    console.log(game_id);
  });

  socket.on('join party', function(party_id) {
    socket.join(party_id);
  });


  // const placeholderObject = {
  //   party: {
  //     game_id,
  //     title,
  //     owner_id,
  //     description,
  //     require_app,
  //   },
  //   spots: [
  //     {
  //       filled: 1,
  //       roles: []
  //     },
  //   ],    
  //   req: [ 
  //   ],  
  // }

  socket.on('post party', async function(msg){
    try {
      //make sure user is authorized
      const checkAuth = await requireSocketAuth(app.get('db'), msg.user_auth);
      if (checkAuth) {
        io.to(`${socket.id}`).emit('post party error', checkAuth);
        return;
      }
      //check for missing fields
      if (!msg.party.game_id || !msg.party.title || !msg.party.owner_id) {
        io.to(`${socket.id}`).emit('post party error', 'Invalid party information provided');
        return;
      }
      if (msg.spots.length < 2) {
        io.to(`${socket.id}`).emit('post party error', 'Must have at least one spot available');
        return;
      }
      //please work
      const db = app.get('db');
      //inserts the party and grabs the ID
      const { id } = await PartyService.insertParty(msg.party);
      //updates all spots and the roles associated with said spot
      await Promise.all(
        ...msg.spots.map(async (spot) => {
          await SpotService.insertSpot(db, id, spot.roles, spot.filled); 
        }),
        ...msg.reqs.map(async (req_id) => {
          await ReqService.insertReq(db, id, req_id);
        })
      );
      //now that all requirements and spots are inserted, update DB so it knows party is publicly ready
      await PartyService.setReady(db, id);
      //grab the party details
      const party = await PartyService.getPartyById(db, id)
      //emit the party details to everyone in the room.
      io.in(msg.room_id).emit('posted party', party);
    } catch(err) {
      console.log(err);
      io.to(`${socket.id}`).emit('post party error', 'Something went wrong, check the party information');
    }
  });

  //delete party

  socket.on('disconnect', function() {
    //check how many people are in the room they left
    //delete if answer is < 1
  });

  socket.on('disconnect', function() {
    console.log('disconnected!');
  });


});

module.exports = server;