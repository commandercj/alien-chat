import { io } from "socket.io-client"

const socket = io("https://alien-chat.onrender.com", {
  autoConnect: true
})

export default socket