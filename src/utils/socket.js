import { io } from "socket.io-client";

export const createInstanceSocket = ()=>{
    const socket = io(process.env.REACT_APP_SOCKET_URL_SERVER);
    return socket;
}