import { io } from "socket.io-client";

let socket = null;

export const initializeSocketConnection = () => {
  if (!socket) {
    socket = io("http://localhost:3000", {
      withCredentials: true,
      transports: ["websocket", "polling"],
    });

    socket.on("connect", () => {
      console.log("Connected to socket:", socket.id);
    });

    socket.on("disconnect", (reason) => {
      console.log("Disconnected from socket:", reason);
    });
  }

  return socket;
};