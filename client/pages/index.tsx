import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import { useSockets } from "../context/socket.context";
import Rooms from "../containers/Rooms";
import Messages from "../containers/Messages";
import { useRef } from "react";
const Home: NextPage = () => {
    const { socket, username, setUsername } = useSockets();
    const usernameRef = useRef<HTMLInputElement | null>(null);

    const handleSetUsername = () => {
      const value = usernameRef.current?.value;
      if(!value){
        return 
      }
      setUsername(value)
      localStorage.setItem("username", value)
    }

    return (
        <div>

          {!username && (
            <div className={styles.usernameWrapper}>
              <div className={styles.usernameInner}>
              <input type="text" placeholder="Username" ref={usernameRef} />
              <button onClick={handleSetUsername}>Start chatting</button>
            </div>
            </div>
          )}
          {username && (
            <div className={styles.container}>
              <Rooms />
            <Messages />
            </div>
          )}
            
        </div>
    );
};

export default Home;
