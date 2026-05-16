"use client"

import { useEffect, useState, useRef } from "react"
import { useParams } from "next/navigation"
import socket from "@/lib/socket"

export default function ChatRoom() {
  const { room } = useParams()

  const [username, setUsername] = useState("")
  const [joined, setJoined] = useState(false)
  const [message, setMessage] = useState("")
  const [messages, setMessages] = useState<any[]>([])

  const endRef = useRef<HTMLDivElement | null>(null)

  // 🔐 JOIN ROOM (safe)
  useEffect(() => {
    if (!room || !joined) return
    socket.emit("join_room", room)
  }, [room, joined])

  // 📩 RECEIVE MESSAGES
  useEffect(() => {
    const handleMessage = (msg: any) => {
      setMessages((prev) => [...prev, msg])
    }

    socket.on("receive_message", handleMessage)

    return () => {
      socket.off("receive_message", handleMessage)
    }
  }, [])

  // 🔽 AUTO SCROLL
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // 📤 SEND MESSAGE
  const sendMessage = () => {
    if (!message.trim() || !username || !room) return

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
      <div style={styles.box}>
        <h2>👽 Alien Private Chat</h2>
        <p style={styles.room}>Room: {room}</p>

        {/* 🔐 JOIN SCREEN */}
        {!joined ? (
          <div style={styles.joinBox}>
            <input
              placeholder="Enter username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={styles.input}
            />

            <button
              style={styles.joinBtn}
              onClick={() => {
                if (!username.trim()) return
                setJoined(true)
              }}
            >
              Join Chat
            </button>
          </div>
        ) : (
          <>
            {/* 💬 CHAT */}
            <div style={styles.chat}>
              {messages.map((m, i) => (
                <div
                  key={i}
                  style={{
                    ...styles.msg,
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
                  <b>{m.username}</b>
                  <div>{m.message}</div>
                  <small>{m.time}</small>
                </div>
              ))}
              <div ref={endRef} />
            </div>

            {/* ⌨ INPUT */}
            <div style={styles.bottom}>
              <input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type message..."
                style={styles.input}
              />

              <button onClick={sendMessage} style={styles.sendBtn}>
                Send
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

const styles: any = {
  app: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    background: "radial-gradient(circle at top,#0a0f1f,#000)",
    color: "#00ffd5",
    fontFamily: "monospace"
  },

  box: {
    width: "520px",
    border: "1px solid #00ffd5",
    borderRadius: "14px",
    padding: "20px",
    background: "rgba(0,0,0,0.6)"
  },

  room: {
    fontSize: "12px",
    opacity: 0.7
  },

  joinBox: {
    display: "flex",
    flexDirection: "column",
    gap: "10px"
  },

  chat: {
    height: "320px",
    overflowY: "auto",
    margin: "15px 0",
    padding: "10px",
    border: "1px solid rgba(0,255,213,0.3)",
    borderRadius: "10px",
    display: "flex",
    flexDirection: "column",
    gap: "10px"
  },

  msg: {
    padding: "10px",
    borderRadius: "12px",
    maxWidth: "70%"
  },

  bottom: {
    display: "flex",
    gap: "10px"
  },

  input: {
    flex: 1,
    padding: "12px",
    background: "#000",
    border: "1px solid #00ffd5",
    color: "#00ffd5",
    borderRadius: "10px",
    outline: "none"
  },

  joinBtn: {
    padding: "12px",
    background: "#00ffd5",
    border: "none",
    fontWeight: "bold",
    borderRadius: "10px",
    cursor: "pointer"
  },

  sendBtn: {
    padding: "12px 16px",
    background: "linear-gradient(45deg,#00ffd5,#0066ff)",
    border: "none",
    fontWeight: "bold",
    borderRadius: "10px",
    cursor: "pointer",
    color: "#000"
  }
}