import React, { useRef } from "react";
import EVENTS from "../config/events";
import { useSockets } from "../context/socket.context";

const Rooms = () => {
    const { socket, roomId, rooms } = useSockets();
    const newRoomRef = useRef<HTMLInputElement | null>(null);

    const handleCreateRoom = () => {
        const roomName = newRoomRef.current?.value || "";
        if (!roomName.trim()) return;
        socket.emit(EVENTS.CLIENT.CREATE_ROOM, { roomName });
        if (newRoomRef.current) {
            newRoomRef.current.value = "";
        }
    };
    return (
        <nav>
            <div>
                <input ref={newRoomRef} placeholder="Room name" />
                <button onClick={handleCreateRoom}>Create Room</button>
            </div>
        </nav>
    );
};

export default Rooms;
