import { io } from "socket.io-client";


const socket = io("https://chatly-app-chi.vercel.app", {
  withCredentials: true,
  transports: ["websocket"],
  autoConnect: false,
});
export default socket;