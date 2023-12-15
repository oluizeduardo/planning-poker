import logger from "./config/logger.js";
import io from "./server.js";
import { v4 as uuidv4, v5 as uuidv5 } from "uuid";

const rooms = [];

io.on("connection", handleConnection);

function handleConnection(socket) {
  logger.info("New WebSocket connection");

  socket.on("create_room", (roomName, callback) => {
    handleCreateRoom(socket, roomName, callback);
  });
  socket.on("connect_room", (roomId, callback) => {
    handleConnectRoom(socket, roomId, callback);
  });
  socket.on("disconnect", (reason) => {
    handleDisconnect(socket, reason);
  });
}

function handleCreateRoom(socket, roomName, callback) {
  if (typeof callback !== "function") {
    return socket.disconnect();
  }
  const roomId = createIdFromString(roomName);
  addRoom({
    id: roomId,
    name: roomName
  });
  callback(roomId);
}

function handleConnectRoom(socket, roomId, callback) {
  
  const foundRoom = findRoomById(roomId);
  
  if (foundRoom){
    socket.join(roomId);
    logger.info(`New client connected - Client id: [${socket.id}] - Room name: [${foundRoom.name}] - Room id: [${foundRoom.id}]`);
    callback(foundRoom);
  }else{
    logger.warn(`Attempted to join non-existent room.`);
    callback(foundRoom);
  }
}

function handleDisconnect(socket, reason) {
  logger.info(`Client [${socket.id}] disconnected! - Reason: ${reason}`);
}

function createIdFromString(text) {
  const randomUuid = uuidv4();
  return uuidv5(text, randomUuid);
}

function addRoom(room) {
  rooms.push(room);
}

function findRoomById(roomId) {
  return rooms.find(room => room.id === roomId);
}
