import { createContext, useContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { SOCKET_URL } from "../config/default";
import EVENTS from "../config/events";

interface Message {
    message: string,
    username: string;
    time: string
}

interface Context {
    socket: Socket;
    username?: string;
    setUsername: Function;
    roomId?: string;
    rooms: object;
    messages: Message[];
    setMessages: Function
}

const socket = io(SOCKET_URL);
const SocketContext = createContext<Context>({
    socket,
    setUsername: () => false,
    rooms: {},
    messages: [],
    setMessages: () => false
});


function SocketsProvider(props: any) {
    const [username, setUsername] = useState("");
    const [roomId, setRoomId] = useState("")
    const [rooms, setRooms] = useState({})
    const [messages, setMessages] = useState<Message[]>([])

    useEffect(() => {
        window.onfocus = function() {
            document.title = "Chat App"
        }
    }, [])

    socket.on(EVENTS.SERVER.ROOMS, (value) => {
        setRooms(value)
    })

    socket.on(EVENTS.SERVER.JOINED_ROOM, (value) => {
        setRoomId(value)
        setMessages([])
    })

    socket.on(EVENTS.SERVER.ROOM_MESSAGE, ({message, username, time}) => {

        if(!document.hasFocus()) {
            document.title = "New Message!"
        }
        setMessages([
            ...messages, { message, username, time}
        ])
    })
    return (
        <SocketContext.Provider
            value={{ socket, username, setUsername, rooms, roomId, messages, setMessages }}
            {...props}
        />
    );
}

export const useSockets = () => useContext(SocketContext);
export default SocketsProvider;
