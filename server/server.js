const express = require("express")
const http = require("http")
const { Server } = require("socket.io")
const cors = require("cors")

const app = express()

app.use(cors())

const server = http.createServer(app)

const io = new Server(server, {
  cors: {
    origin: "https://alien-chat.onrender.com",
    methods: ["GET", "POST"]
  }
})

io.on("connection", (socket) => {
  console.log("User connected")

  socket.on("join_room", (room) => {
    socket.join(room)
    console.log("Joined room:", room)
  })

  socket.on("send_message", (data) => {
    console.log("Message:", data)

    // SEND TO EVERYONE INCLUDING SENDER
    io.to(data.room).emit("receive_message", data)
  })

  socket.on("disconnect", () => {
    console.log("User disconnected")
  })
})

server.listen(5000, () => {
  console.log("Server running on port 5000")
})
