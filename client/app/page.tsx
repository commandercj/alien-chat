"use client"

import { useEffect, useRef, useState } from "react"
import socket from "@/lib/socket"
import { v4 as uuidv4 } from "uuid"

export default function Home() {
  const [message, setMessage] = useState("")
  const [messages, setMessages] = useState<any[]>([])
  const [username, setUsername] = useState("")
  const [room, setRoom] = useState("")
  const [joined, setJoined] = useState(false)
  const [typing, setTyping] = useState("")

  const messagesEndRef = useRef<HTMLDivElement | null>(null)

  // ✅ JOIN ROOM FIXED
  useEffect(() => {
    if (!room || !joined) return
    socket.emit("join_room", room)
  }, [room, joined])

  // ✅ RECEIVE MESSAGES FIXED
  useEffect(() => {
    socket.on("receive_message", (msg) => {
      setMessages((prev) => [...prev, msg])
    })

    socket.on("typing", (data) => {
      setTyping(data)

      setTimeout(() => {
        setTyping("")
      }, 1000)
    })

    return () => {
      socket.off("receive_message")
      socket.off("typing")
    }
  }, [])

  // auto scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth"
    })
  }, [messages])

  const createRoom = () => {
    const newRoom = uuidv4().slice(0, 6)
    setRoom(newRoom)
  }

  const joinRoom = () => {
    if (!username || !room) return

    socket.emit("join_room", room)
    setJoined(true)
  }

  // ✅ SEND MESSAGE FIXED
  const sendMessage = () => {
    if (!message.trim() || !room || !username) return

    const msgData = {
      room,
      username,
      message,
      time: new Date().toLocaleTimeString()
    }

    socket.emit("send_message", msgData)

    setMessages((prev) => [...prev, msgData]) // instant UI update
    setMessage("")
  }

  // typing fix
  const handleTyping = (value: string) => {
    setMessage(value)

    if (username && room) {
      socket.emit("typing", username)
    }
  }

  return (
    <div style={styles.app}>
      {/* SIDEBAR */}
      <div style={styles.sidebar}>
        <h1 style={styles.logo}>👽 Alien Chat</h1>

        <input
          style={styles.input}
          placeholder="Enter username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          style={styles.input}
          placeholder="Room code"
          value={room}
          onChange={(e) => setRoom(e.target.value)}
        />

        <button style={styles.button} onClick={joinRoom}>
          Join Room
        </button>

        <button style={styles.createBtn} onClick={createRoom}>
          Create Room
        </button>

        {room && (
          <div style={styles.roomBox}>
            <div>Your Room Code:</div>
            <b>{room}</b>
          </div>
        )}
      </div>

      {/* CHAT AREA */}
      <div style={styles.chat}>
        <div style={styles.header}>
          <h2>🚀 Room: {room || "No Room Joined"}</h2>
        </div>

        <div style={styles.messages}>
          {messages.map((m, i) => (
            <div
              key={i}
              style={{
                ...styles.message,
                alignSelf:
                  m.username === username ? "flex-end" : "flex-start",
                background:
                  m.username === username ? "#00ffcc" : "#111"
              }}
            >
              <div style={styles.meta}>
                <b>{m.username}</b>
                <span>{m.time}</span>
              </div>

              <div>{m.message}</div>
            </div>
          ))}

          {typing && (
            <div style={styles.typing}>
              {typing} is typing...
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        <div style={styles.inputBox}>
          <input
            style={styles.chatInput}
            placeholder="Type your alien message..."
            value={message}
            onChange={(e) => handleTyping(e.target.value)}
          />

          <button style={styles.sendBtn} onClick={sendMessage}>
            Send
          </button>
        </div>
      </div>
    </div>
  )
}

const styles: any = {
  app: {
    display: "flex",
    height: "100vh",
    background: "radial-gradient(circle at top, #05010a, #000000)",
    color: "#00ffcc",
    fontFamily: "Courier New, monospace"
  },
  sidebar: {
    width: "270px",
    background: "rgba(0,255,204,0.05)",
    borderRight: "1px solid #00ffcc",
    padding: "20px",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    boxShadow: "0 0 20px #00ffcc33"
  },
  logo: { textShadow: "0 0 15px #00ffcc" },
  roomBox: {
    marginTop: "20px",
    padding: "10px",
    border: "1px solid #00ffcc55",
    borderRadius: "10px",
    textAlign: "center"
  },
  chat: {
    flex: 1,
    display: "flex",
    flexDirection: "column"
  },
  header: {
    padding: "15px",
    borderBottom: "1px solid #00ffcc33",
    background: "rgba(0,0,0,0.4)"
  },
  messages: {
    flex: 1,
    overflowY: "auto",
    padding: "15px",
    display: "flex",
    flexDirection: "column",
    gap: "10px"
  },
  message: {
    padding: "12px",
    borderRadius: "12px",
    maxWidth: "60%",
    color: "#fff",
    boxShadow: "0 0 10px #00ffcc22"
  },
  meta: {
    display: "flex",
    justifyContent: "space-between",
    fontSize: "11px",
    marginBottom: "5px",
    opacity: 0.7
  },
  typing: { fontSize: "12px", opacity: 0.7 },
  inputBox: {
    display: "flex",
    padding: "10px",
    borderTop: "1px solid #00ffcc33",
    background: "rgba(0,0,0,0.5)"
  },
  chatInput: {
    flex: 1,
    padding: "12px",
    background: "#000",
    border: "1px solid #00ffcc55",
    color: "#00ffcc",
    borderRadius: "8px",
    outline: "none"
  },
  sendBtn: {
    marginLeft: "10px",
    padding: "12px 16px",
    background: "linear-gradient(45deg,#00ffcc,#0066ff)",
    border: "none",
    color: "#000",
    fontWeight: "bold",
    borderRadius: "8px",
    cursor: "pointer"
  },
  input: {
    padding: "12px",
    background: "#000",
    border: "1px solid #00ffcc55",
    color: "#00ffcc",
    borderRadius: "8px",
    outline: "none"
  },
  button: {
    padding: "12px",
    background: "linear-gradient(45deg,#00ffcc,#00ff88)",
    border: "none",
    color: "#000",
    fontWeight: "bold",
    borderRadius: "8px",
    cursor: "pointer"
  },
  createBtn: {
    padding: "12px",
    background: "linear-gradient(45deg,#ff00ff,#00ccff)",
    border: "none",
    color: "#fff",
    fontWeight: "bold",
    borderRadius: "8px",
    cursor: "pointer"
  }
}