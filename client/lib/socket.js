import { io } from "socket.io-client"

const socket = io("https://alien-chat.onrender.com", {
  transports: ["websocket"]
})

export default socket