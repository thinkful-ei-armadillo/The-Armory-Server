const app = require('./app');
const PartyService = require('../src/party/party-service');
const SpotService = require('../src/spots/spot-service');
const ReqService = require('../src/requirements/req-service');
const { requireSocketAuth } = require('../src/middleware/jwt-auth');
//io testing stuff
const server = require('http').Server(app);
const io = require('socket.io')(server);
const uuid = require('uuid/v4');

io.on('connection', function(socket) {
  console.log('connected!');

  socket.on('join game', function(room_id) {
    socket.join(room_id);
  });

  socket.on('join party', function(room_id) {
    socket.join(room_id);
  });

  socket.on('post party', async function(msg){
    try {
      //make sure user is authorized, if they are, add the owner id to the party object
      const userId = await requireSocketAuth(app.get('db'), msg.user_auth);
      msg.party.owner_id = userId;
      //check for missing fields
      if (!msg.party.game_id || !msg.party.title) {
        io.to(`${socket.id}`).emit('post party error', 'Invalid party information provided');
        return;
      }
      //if there is less than one spot additional to the always required owner spot
      if (msg.spots.length < 1) {
        io.to(`${socket.id}`).emit('post party error', 'Must have at least one spot available');
        return;
      }
      //please work
      const db = app.get('db');
      //inserts the party and grabs the ID
      const partyId = await PartyService.insertParty(db, msg.party);
      //updates all spots and the roles associated with said spot
      await Promise.all([
        await SpotService.insertSpot(db, partyId, [], userId), 
        await ReqService.insertReq(db, partyId, msg.requirement),
        ...msg.spots.map(async(spot) => {
          return await SpotService.insertSpot(db, partyId, spot.roles, spot.filled)
        })
      ]);
      //now that all requirements and spots are inserted, update DB so it knows party is publicly ready
      await PartyService.setReady(db, partyId);
      //grab the party details
      const party = await PartyService.serializeParty(app.get('db'), await PartyService.getPartyById(db, partyId));
      //emit the party details to everyone in the room.
      io.sockets.in(msg.room_id).emit('posted party', party);
    } catch(err) {
      console.error(err);
      if (err.message === "Unauthorized request") {
        io.to(`${socket.id}`).emit('post party error', 'Unauthorized request');
        return;
      }
      io.to(`${socket.id}`).emit('post party error', 'Something went wrong, check the party information');
    }
  });

  

  socket.on('leave party', async function(msg){
    const db = app.get('db');
    const {party_id, user_auth, room_id, game_id} = msg;
    try {
      const user_id = await requireSocketAuth(db, user_auth);
      const spot = await SpotService.updateSpots(db, party_id, {filled: user_id});
      const owner_id = await PartyService.getOwnerId(db, party_id);
      if(owner_id === user_id){
        const newOwners = await SpotService.getNewOwnerId(db, owner_id, party_id);
        if(newOwners.length < 1){
          PartyService.deleteParty(db, party_id);
          io.sockets.in(`/games/${game_id}`).emit('party deletion', party_id);
        }
        if(newOwners.id){
          await PartyService.updateParty(db, party_id, {owner_id:newOwners.id});
        }
      }
      const party = await PartyService.serializeParty(db, await PartyService.getPartyById(db, party_id))
      io.sockets.in(room_id).emit('left party', party);
      

    } catch(err) {
      console.error(err);
      if (err.message === "Unauthorized request") {
        io.to(`${socket.id}`).emit('post party error', 'Unauthorized request');
        return;
      }
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