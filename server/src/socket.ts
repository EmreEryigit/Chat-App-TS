import { Server, Socket } from "socket.io";
import log from "./utls/logger";



const EVENTS = {
    connection : "connection",
    CLIENT: {
        CREATE_ROOM: "CREATE_ROOM"
    }
}

function socket({io}: {io:  Server}) {
    log.info(`Socket enabled`)

    io.on(EVENTS.connection, (socket: Socket) => {
        log.info(`User connected ${socket.id}`)
        socket.on(EVENTS.CLIENT.CREATE_ROOM, ({roomName}) => {
            console.log(roomName)
        })
    })
    
}

export default socket