import React, { useRef } from "react";
import EVENTS from "../config/events";
import { useSockets } from "../context/socket.context";
import styles from "../styles/Messages.module.css"
const Messages = () => {
    const messageRef = useRef<HTMLTextAreaElement>(null);
    const { socket, messages, roomId, rooms, username, setMessages } =
        useSockets();

    const handleSendMessage = () => {
        const message = messageRef.current?.value;

        if (!message?.trim()) {
            return;
        }

        socket.emit(EVENTS.CLIENT.SEND_ROOM_MESSAGE, {
            roomId,
            message,
            username,
        });

        const date = new Date();
        setMessages([
            ...messages,
            {
                username: "You",
                message,
                time: `${date.getHours()}:${date.getMinutes()}`,
            },
        ]);
        if (messageRef.current) {
          messageRef.current.value = "";
      }
    };

    if (!roomId) return <div />;

    return (
        <div className={styles.wrapper}>
            <div className={styles.messageList}>

           
            {messages.map((message, index) => (
                <div key={index} className={styles.message}>
                    <div className={styles.messageInner}>
                <span className={styles.messageSender}>{message.username} - {message.time}</span>
                <span className={styles.messageBody}>{message.message}</span>
                    </div>
                </div>
            ))}
             </div>

            <div className={styles.messageBox}>
                <textarea
                    name=""
                    id=""
                    placeholder="Send a message..."
                    ref={messageRef}
                    rows={1}
                ></textarea>
                <button onClick={handleSendMessage}>Send</button>
            </div>
        </div>
    );
};

export default Messages;
