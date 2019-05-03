let io;
let app;
const { requireSocketAuth } = require("./middleware/jwt-auth");
const SpotService = require("./spots/spot-service");
const PartyService = require("./party/party-service");
const uuid = require("uuid");
const xss = require('xss');

const ioService = {
  setUpIo(ioInstance) {
    io = ioInstance;
    io.on("connection", function(socket) {
      console.log("connected!");

      socket.on("leave party", async function(msg) {
        const db = app.get("db");
        const { party_id, user_auth, room_id, game_id } = msg;
        try {
          const user_id = await requireSocketAuth(db, user_auth);
          console.log("after await user auth", user_id);

          const spot = await SpotService.findUserSpot(db, user_id, party_id);
          console.log("spot_id", spot.id);

          await SpotService.updateSpot(db, spot.id, { filled: null });
          const { owner_id } = await PartyService.getOwnerId(db, party_id);
          console.log("owner_id", owner_id);

          if (owner_id === user_id) {
            const newOwners = await SpotService.getNewOwnerId(
              db,
              owner_id,
              party_id
            );
            console.log("newOwners", newOwners);

            if (newOwners.length < 1) {
              await PartyService.deleteParty(db, party_id);
              io.sockets
                .in(`/games/${game_id}`)
                .emit("update parties", party_id);
            }
            if (newOwners[0].filled) {
              await PartyService.updateParty(db, party_id, {
                owner_id: newOwners[0].filled
              });
            }
          }
          const party = await PartyService.serializeParty(
            db,
            await PartyService.getPartyById(db, party_id)
          );
          console.log("party", party);

          io.sockets.in(room_id).emit("update party");
          io.sockets.in(`/games/${game_id}`).emit("update parties");
          console.log("game_id", game_id);
        } catch (err) {
          console.error(err);
          if (err.message === "Unauthorized request") {
            io.to(`${socket.id}`).emit(
              "post party error",
              "Unauthorized request"
            );
            return;
          }
          io.to(`${socket.id}`).emit(
            "post party error",
            "Something went wrong, check the party information"
          );
        }
      });

      socket.on("join room", function(room_id) {
        socket.join(room_id);
      });

      socket.on("chat message", async function(messageData) {
        const roomId = messageData.room_id;
        if(messageData.id){
          const newMessage = {
            message_body: messageData.message,
          }
          const party_id = roomId.split('/').splice(2, 1).join('');
          const update = await PartyService.updateChatMessage(app.get('db'), messageData.id, newMessage)
          const updatedMessages = await PartyService.getPartyMessages(app.get('db'), party_id)
          io.sockets.in(roomId).emit("update chat", updatedMessages);
        } else {
          const party_id = roomId.split('/').splice(2, 1).join('');
          messageData = {
            party_id,
            message_body: xss(messageData.message),
            owner_id: messageData.user_id,
            time_created: messageData.timeStamp
          }
          const newMessage = await PartyService.insertMessage(app.get("db"), messageData);
          const messages = await PartyService.getPartyMessages(app.get('db'), party_id);
          io.sockets.in(roomId).emit("update chat", messages);
        }
      });

      socket.on("delete chat message", function(messageData) {
        console.log(messageData);
        io.sockets.in(messageData.room_id).emit("delete chat message", messageData.message_id);
      })

      socket.on("leave game", function() {
        console.log(socket.id);
      });

      socket.on("disconnect", function() {
        console.log("disconnected");
      });
    });
  },
  emitRoomEvent(event_name, room_id, data) {
    io.sockets.in(room_id).emit(event_name, data);
  },
  setApp(appInstance) {
    app = appInstance;
  }
};

module.exports = ioService;
