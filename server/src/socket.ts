import { Server, Socket } from "socket.io";
import log from "./utils/logger";
import { v4 as uuidv4 } from 'uuid';

const EVENTS = {
    connection: "connection",
    CLIENT: {
        CREATE_ROOM: "CREATE_ROOM",
        SEND_ROOM_MESSAGE: "SEND_ROOM_MESSAGE",
        JOIN_ROOM: "JOIN_ROOM"
    },
    SERVER: {
        ROOMS: "ROOMS",
        JOINED_ROOM: "JOINED_ROOM",
        ROOM_MESSAGE: "ROOM_MESSAGE"
    },
};

const rooms: Record<string, { name: string }> = {};

function socket({ io }: { io: Server }) {
    log.info(`Socket enabled`);


    // Creating a room
    io.on(EVENTS.connection, (socket: Socket) => {
        log.info(`User connected ${socket.id}`);

        socket.emit(EVENTS.SERVER.ROOMS, rooms)
        
        socket.on(EVENTS.CLIENT.CREATE_ROOM, ({ roomName }) => {
            // creating a room id
            const roomId = uuidv4();
            // adding our new room to rooms array
            rooms[roomId] = {
                name: roomName,
            };
            socket.join(roomId);
            // broadcasting an event to all users
            socket.broadcast.emit(EVENTS.SERVER.ROOMS, rooms);

            // emiting back to the creator of room
            socket.emit(EVENTS.SERVER.ROOMS, rooms);
            socket.emit(EVENTS.SERVER.JOINED_ROOM, roomId);
        });

        socket.on(EVENTS.CLIENT.SEND_ROOM_MESSAGE, ({roomId, message, username}) => {
            const date = new Date()
            socket.to(roomId).emit(EVENTS.SERVER.ROOM_MESSAGE, {
                message,
                username,
                time: `${date.getHours()}:${date.getMinutes()}`
            })
        })

        socket.on(EVENTS.CLIENT.JOIN_ROOM, (roomId) => {
            socket.join(roomId)
            socket.emit(EVENTS.SERVER.JOINED_ROOM, roomId)
        })
    });
}

export default socket;
