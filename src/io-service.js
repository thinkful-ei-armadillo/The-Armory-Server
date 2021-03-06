let io;
let app;

const GamesService = require("./games/games-service");
const config = require("./config");
const { requireSocketAuth } = require("./middleware/jwt-auth");
const SpotService = require("./spots/spot-service");
const PartyService = require("./party/party-service");
const uuid = require("uuid");
const xss = require("xss");

const ioService = {
  setUpIo(ioInstance) {
    io = ioInstance;

    io.on("connection", function(socket) {

      socket.on("leave party", async function(msg) {
        const db = app.get("db");
        const { party_id, user_auth, room_id, game_id } = msg;
        try {
          const user_id = await requireSocketAuth(db, user_auth);

          const spot = await SpotService.findUserSpot(db, user_id, party_id);

          if (!spot) {
            return;
          }

          await SpotService.updateSpot(db, spot.id, { filled: null });
          const { owner_id } = await PartyService.getOwnerId(db, party_id);

          if (owner_id === user_id) {
            const newOwners = await SpotService.getNewOwnerId(
              db,
              owner_id,
              party_id
            );

            if (newOwners.length < 1) {
              await PartyService.deleteParty(db, party_id);
              // delete all chat messages from party
              // await PartyService.deletePartyChatLogs(db, party_id)
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
          const updatedGamePageParty = await PartyService.serializeGamePageParty(
            db,
            await PartyService.getPartyById(db, party_id)
          );
          const updatedParty = await PartyService.serializeParty(
            db,
            await PartyService.getPartyById(db, party_id)
          );

          const [{ count }] = await SpotService.getSpotsLeft(db, party_id);

          if (count < 2) {
            await PartyService.deleteParty(db, party_id);
          }

          ioService.emitRoomEvent(count < 2 ? 'delist party' : 'spot updated', `/games/${game_id}`, updatedGamePageParty);
          ioService.emitRoomEvent('update party', room_id, updatedParty);
        } catch (err) {
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
        const party_id = roomId
          .split("/")
          .splice(2, 1)
          .join("");
        messageData = {
          party_id,
          message_body: xss(messageData.message),
          owner_id: messageData.user_id,
          time_created: messageData.timeStamp,
          unix_stamp: messageData.unix_stamp
        };
        await PartyService.insertMessage(app.get("db"), messageData);
        await PartyService.insertIntoArchive(app.get("db"), messageData);
        const messages = await PartyService.getPartyMessages(
          app.get("db"),
          party_id
        );
        io.sockets.in(roomId).emit("update chat", messages);
      });

      socket.on("edit chat message", async function(messageData) {
        const roomId = messageData.room_id;
        const party_id = roomId
          .split("/")
          .splice(2, 1)
          .join("");
        const newMessage = {
          message_body: messageData.message,
          edited: true
        };
        await PartyService.updateChatMessage(
          app.get("db"),
          messageData.id,
          newMessage
        );

        messageData = {
          party_id,
          message_body: xss(messageData.message),
          owner_id: messageData.user_id,
          time_created: messageData.timeStamp,
          unix_stamp: messageData.unix_stamp
        };
        await PartyService.insertIntoArchive(app.get("db"), messageData);
        const updatedMessages = await PartyService.getPartyMessages(
          app.get("db"),
          party_id
        );
        io.sockets.in(roomId).emit("update chat", updatedMessages);
      });

      socket.on("delete chat message", async function(messageData) {
        await PartyService.deleteChatMessage(app.get("db"), messageData.id);
        const messages = await PartyService.getPartyMessages(
          app.get("db"),
          messageData.party_id
        );

        io.sockets
          .in(messageData.room_id)
          .emit("delete chat message", messages);
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
