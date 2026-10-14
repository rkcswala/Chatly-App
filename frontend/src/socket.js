import { io } from "socket.io-client";


const socket = io("https://chatly-app-chi.vercel.app", {
  autoConnect: false,
});

export default socket;