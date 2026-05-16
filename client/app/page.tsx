"use client"

import { useEffect, useRef, useState } from "react"
import socket from "@/lib/socket"

const users = [
  { name: "Alex", online: true },
  { name: "Ken", online: true },
  { name: "Mika", online: false },
  { name: "Zane", online: true }
]

export default function Home() {
  const [username, setUsername] = useState("")
  const [selectedUser, setSelectedUser] = useState("Alex")
  const [message, setMessage] = useState("")
  const [messages, setMessages] = useState<any[]>([])

  const messagesEndRef = useRef<HTMLDivElement | null>(null)

  // ✅ SAFE ROOM (NO ERROR)
  const room =
    username && selectedUser
      ? [username, selectedUser].sort().join("-")
      : ""

  // JOIN ROOM SAFE
  useEffect(() => {
    if (!room) return
    socket.emit("join_room", room)
  }, [room])

  // RECEIVE MESSAGES
  useEffect(() => {
    const handleMessage = (msg: any) => {
      setMessages((prev) => [...prev, msg])
    }

    socket.on("receive_message", handleMessage)

    return () => {
      socket.off("receive_message", handleMessage)
    }
  }, [])

  // AUTO SCROLL
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth"
    })
  }, [messages])

  // SEND MESSAGE
  const sendMessage = () => {
    if (!message.trim() || !room || !username) return

    const msgData = {
      room,
      username,
      message,
      time: new Date().toLocaleTimeString()
    }

    socket.emit("send_message", msgData)

    setMessages((prev) => [...prev, msgData])
    setMessage("")
  }

  return (
    <div style={styles.app}>
      {/* SIDEBAR */}
      <div style={styles.sidebar}>
        <h1 style={styles.logo}>👽 Alien DM</h1>

        <input
          style={styles.input}
          placeholder="Your username..."
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <div style={styles.title}>DIRECT MESSAGES</div>

        {users.map((user, i) => (
          <div
            key={i}
            onClick={() => setSelectedUser(user.name)}
            style={{
              ...styles.userCard,
              background:
                selectedUser === user.name
                  ? "rgba(0,255,200,0.15)"
                  : "transparent"
            }}
          >
            <div style={styles.userRow}>
              <div
                style={{
                  ...styles.dot,
                  background: user.online ? "#00ff99" : "#444"
                }}
              />
              <span>{user.name}</span>
            </div>
          </div>
        ))}
      </div>

      {/* CHAT */}
      <div style={styles.chat}>
        <div style={styles.header}>
          👾 Chat with {selectedUser}
        </div>

        <div style={styles.messages}>
          {messages
            .filter((m) => m.room === room)
            .map((m, i) => (
              <div
                key={i}
                style={{
                  ...styles.bubble,
                  alignSelf:
                    m.username === username
                      ? "flex-end"
                      : "flex-start",
                  background:
                    m.username === username
                      ? "linear-gradient(45deg,#00ffd5,#0066ff)"
                      : "rgba(255,255,255,0.06)"
                }}
              >
                <div style={styles.meta}>
                  <b>{m.username}</b>
                  <span>{m.time}</span>
                </div>
                <div>{m.message}</div>
              </div>
            ))}

          <div ref={messagesEndRef} />
        </div>

        {/* INPUT */}
        <div style={styles.inputBox}>
          <input
            style={styles.inputMsg}
            placeholder="Type message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
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
    background: "radial-gradient(circle at top,#0a0f1f,#000)",
    color: "#fff",
    fontFamily: "Inter, sans-serif"
  },

  sidebar: {
    width: "280px",
    padding: "20px",
    background: "rgba(255,255,255,0.04)",
    backdropFilter: "blur(20px)",
    borderRight: "1px solid rgba(255,255,255,0.08)"
  },

  logo: {
    color: "#00ffd5",
    marginBottom: "10px"
  },

  input: {
    width: "100%",
    padding: "10px",
    marginBottom: "10px",
    borderRadius: "10px",
    border: "1px solid rgba(255,255,255,0.1)",
    background: "rgba(255,255,255,0.05)",
    color: "#fff"
  },

  title: {
    fontSize: "12px",
    opacity: 0.6,
    marginBottom: "10px"
  },

  userCard: {
    padding: "12px",
    borderRadius: "12px",
    cursor: "pointer",
    marginBottom: "6px"
  },

  userRow: {
    display: "flex",
    alignItems: "center",
    gap: "8px"
  },

  dot: {
    width: "10px",
    height: "10px",
    borderRadius: "50%"
  },

  chat: {
    flex: 1,
    display: "flex",
    flexDirection: "column"
  },

  header: {
    padding: "15px",
    borderBottom: "1px solid rgba(255,255,255,0.08)"
  },

  messages: {
    flex: 1,
    padding: "20px",
    overflowY: "auto",
    display: "flex",
    flexDirection: "column",
    gap: "10px"
  },

  bubble: {
    maxWidth: "60%",
    padding: "12px",
    borderRadius: "14px"
  },

  meta: {
    display: "flex",
    justifyContent: "space-between",
    fontSize: "11px",
    opacity: 0.7,
    marginBottom: "5px"
  },

  inputBox: {
    display: "flex",
    padding: "15px",
    gap: "10px",
    borderTop: "1px solid rgba(255,255,255,0.08)"
  },

  inputMsg: {
    flex: 1,
    padding: "12px",
    borderRadius: "12px",
    border: "1px solid rgba(255,255,255,0.1)",
    background: "rgba(255,255,255,0.05)",
    color: "#fff"
  },

  sendBtn: {
    padding: "12px 18px",
    borderRadius: "12px",
    border: "none",
    background: "linear-gradient(45deg,#00ffd5,#0066ff)",
    color: "#000",
    fontWeight: "bold",
    cursor: "pointer"
  }
}
