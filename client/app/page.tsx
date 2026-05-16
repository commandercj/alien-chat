"use client"

import { useEffect, useState, useRef } from "react"
import { useParams } from "next/navigation"
import socket from "@/lib/socket"

export default function ChatRoom() {
  const { room } = useParams()

  const [username, setUsername] = useState("")
  const [message, setMessage] = useState("")
  const [messages, setMessages] = useState<any[]>([])

  const endRef = useRef<HTMLDivElement | null>(null)

  // JOIN ROOM FROM URL
  useEffect(() => {
    if (!room) return
    socket.emit("join_room", room)
  }, [room])

  // RECEIVE MESSAGES
  useEffect(() => {
    const handleMsg = (msg: any) => {
      setMessages((prev) => [...prev, msg])
    }

    socket.on("receive_message", handleMsg)

    return () => {
      socket.off("receive_message", handleMsg)
    }
  }, [])

  // AUTO SCROLL
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // SEND MESSAGE
  const sendMessage = () => {
    if (!message.trim() || !username) return

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
        <h2>🔗 Room: {room}</h2>

        <input
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={styles.input}
        />

        <div style={styles.chat}>
          {messages.map((m, i) => (
            <div key={i} style={styles.msg}>
              <b>{m.username}</b>: {m.message}
            </div>
          ))}
          <div ref={endRef} />
        </div>

        <div style={styles.bottom}>
          <input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Message..."
            style={styles.input}
          />
          <button onClick={sendMessage} style={styles.btn}>
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
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    background: "#000",
    color: "#00ffd5",
    fontFamily: "monospace"
  },

  box: {
    width: "500px",
    border: "1px solid #00ffd5",
    padding: "20px",
    borderRadius: "12px"
  },

  chat: {
    height: "300px",
    overflowY: "auto",
    margin: "10px 0",
    padding: "10px",
    border: "1px solid #00ffd5"
  },

  msg: {
    marginBottom: "8px"
  },

  bottom: {
    display: "flex",
    gap: "10px"
  },

  input: {
    flex: 1,
    padding: "10px",
    background: "#000",
    border: "1px solid #00ffd5",
    color: "#00ffd5"
  },

  btn: {
    padding: "10px",
    background: "#00ffd5",
    border: "none",
    fontWeight: "bold"
  }
}