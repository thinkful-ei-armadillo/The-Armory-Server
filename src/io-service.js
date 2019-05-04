let io;
const GamesService = require('./games/games-service');
const config = require('./config');

const ioService = {
  setUpIo(ioInstance) {
    io = ioInstance;
    io.on('connection', function(socket) {
      console.log('connected!');
    
    
    
      // socket.on('post party', async function(msg){
      //   let partyId;
      //   try {
      //     //make sure user is authorized, if they are, add the owner id to the party object
      //     const userId = await requireSocketAuth(app.get('db'), msg.user_auth);
      //     msg.party.owner_id = userId;
      //     //check for missing fields
      //     if (!msg.party.game_id || !msg.party.title) {
      //       io.to(`${socket.id}`).emit('post party error', 'Invalid party information provided');
      //       return;
      //     }
      //     //if there is less than one spot additional to the always required owner spot
      //     if (msg.spots.length < 1) {
      //       io.to(`${socket.id}`).emit('post party error', 'Must have at least one spot available');
      //       return;
      //     }
      //     //please work
      //     const db = app.get('db');
      //     //inserts the party and grabs the ID
      //     partyId = await PartyService.insertParty(db, msg.party);
      //     //updates all spots and the roles associated with said spot
      //     await Promise.all([
      //       await SpotService.insertSpot(db, partyId, [], userId), 
      //       await ReqService.insertReq(db, partyId, msg.requirement),
      //       ...msg.spots.map(async(spot) => {
      //         return await SpotService.insertSpot(db, partyId, spot.roles, spot.filled)
      //       })
      //     ]);
      //     //now that all requirements and spots are inserted, update DB so it knows party is publicly ready
      //     await PartyService.setReady(db, partyId);
      //     //grab the party details
      //     const party = await PartyService.serializeParty(db, await PartyService.getPartyById(db, partyId));
      //     //emit the party details to everyone in the room.
      //     io.sockets.in(msg.room_id).emit('posted party', party);
      //   } catch(err) {
      //     console.error(err);
      //     //if there was an error but SOME of the stuff was inserted, need to delete to prevent it staying forever, deleting party cascades
      //     if (partyId) {
      //       await PartyService.deleteParty(db, partyId);
      //     }
      //     if (err.message === "Unauthorized request") {
      //       io.to(`${socket.id}`).emit('post party error', 'Unauthorized request');
      //       return;
      //     }
      //     io.to(`${socket.id}`).emit('post party error', 'Something went wrong, check the party information');
      //   }
      // });

      socket.on('get updated pages available', async function(msg) {
        const { gameId, roleFilters, requirementFilters, searchTerm, gamemodeFilter } = msg;
        const [partyCount] = await GamesService.getPartyCount(req.app.get("db"), gameId, searchTerm, gamemodeFilter, requirementFilters, roleFilters);
        io.to(socket.id).emit('updated pages available', Math.ceil(partyCount.count/config.PARTY_DISPLAY_LIMIT));
      })

      socket.on('join room', function(room_id) {
        console.log(room_id);
        socket.join(room_id);
      });
    
      socket.on('leave game', function() {
        console.log(socket.id);
      });
    
      socket.on('disconnect', function() {
        console.log('disconnected');
      });
    
    
    });
  },
  emitRoomEvent(event_name, room_id, data) {
    io.sockets.in(room_id).emit(event_name, data);
  }
};

module.exports = ioService;


