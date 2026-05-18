"use client"

import {
  useEffect,
  useRef,
  useState
} from "react"

import { useParams } from "next/navigation"

import socket from "@/lib/socket"

type Message = {
  id: number
  room: string
  username: string
  text: string
  time: string
}

export default function ChatRoom() {
  const params =
    useParams<{ room: string }>()

  const room = params.room || ""

  const [joined, setJoined] =
    useState(false)

  const [username, setUsername] =
    useState("")

  const [message, setMessage] =
    useState("")

  const [messages, setMessages] =
    useState<Message[]>([])

  const endRef =
    useRef<HTMLDivElement | null>(
      null
    )

  // JOIN ROOM
  useEffect(() => {
    if (!joined || !room) return

    socket.emit("join_room", room)
  }, [joined, room])

  // RECEIVE
  useEffect(() => {
    const receiveMessage = (
      data: Message
    ) => {
      setMessages((prev) => [
        ...prev,
        data
      ])
    }

    socket.on(
      "receive_message",
      receiveMessage
    )

    return () => {
      socket.off(
        "receive_message",
        receiveMessage
      )
    }
  }, [])

  // AUTO SCROLL
  useEffect(() => {
    endRef.current?.scrollIntoView({
      behavior: "smooth"
    })
  }, [messages])

  // SEND
  const sendMessage = () => {
    if (
      !message.trim() ||
      !username.trim()
    )
      return

    const data: Message = {
      id: Date.now(),
      room,
      username,
      text: message,
      time:
        new Date().toLocaleTimeString()
    }

    socket.emit(
      "send_message",
      data
    )

    setMessage("")
  }

  return (
    <div style={styles.app}>
      <div style={styles.chatBox}>
        {/* HEADER */}
        <div style={styles.header}>
          <div>
            <h1 style={styles.logo}>
              Zenith
            </h1>

            <p style={styles.room}>
              Room: {room}
            </p>
          </div>
        </div>

        {/* JOIN */}
        {!joined ? (
          <div style={styles.joinBox}>
            <input
              style={styles.input}
              placeholder="Enter username"
              value={username}
              onChange={(e) =>
                setUsername(
                  e.target.value
                )
              }
            />

            <button
              style={styles.joinBtn}
              onClick={() => {
                if (
                  !username.trim()
                )
                  return

                setJoined(true)
              }}
            >
              Join Chat
            </button>
          </div>
        ) : (
          <>
            {/* MESSAGES */}
            <div style={styles.messages}>
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  style={{
                    ...styles.message,
                    alignSelf:
                      msg.username ===
                      username
                        ? "flex-end"
                        : "flex-start",
                    background:
                      msg.username ===
                      username
                        ? "#00ffd5"
                        : "#151515",
                    color:
                      msg.username ===
                      username
                        ? "#000"
                        : "#fff"
                  }}
                >
                  <div
                    style={styles.top}
                  >
                    <b>
                      {msg.username}
                    </b>

                    <small>
                      {msg.time}
                    </small>
                  </div>

                  <div>
                    {msg.text}
                  </div>
                </div>
              ))}

              <div ref={endRef} />
            </div>

            {/* INPUT */}
            <div style={styles.inputArea}>
              <input
                style={
                  styles.messageInput
                }
                placeholder="Type message..."
                value={message}
                onChange={(e) =>
                  setMessage(
                    e.target.value
                  )
                }
                onKeyDown={(e) => {
                  if (
                    e.key === "Enter"
                  ) {
                    sendMessage()
                  }
                }}
              />

              <button
                style={styles.sendBtn}
                onClick={sendMessage}
              >
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
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background:
      "linear-gradient(to bottom,#050505,#111)",
    fontFamily:
      "Arial,sans-serif"
  },

  chatBox: {
    width: "430px",
    height: "720px",
    background: "#0b0b0b",
    borderRadius: "24px",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
    border:
      "1px solid rgba(0,255,213,.15)"
  },

  header: {
    padding: "18px",
    borderBottom:
      "1px solid rgba(255,255,255,.08)"
  },

  logo: {
    color: "#00ffd5",
    margin: 0
  },

  room: {
    color: "#777",
    fontSize: "12px"
  },

  joinBox: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    padding: "24px",
    gap: "12px"
  },

  input: {
    padding: "14px",
    background: "#121212",
    border:
      "1px solid rgba(255,255,255,.08)",
    borderRadius: "14px",
    color: "#fff",
    outline: "none"
  },

  joinBtn: {
    padding: "14px",
    background: "#00ffd5",
    border: "none",
    color: "#000",
    borderRadius: "14px",
    cursor: "pointer",
    fontWeight: "bold"
  },

  messages: {
    flex: 1,
    overflowY: "auto",
    padding: "18px",
    display: "flex",
    flexDirection: "column",
    gap: "12px"
  },

  message: {
    maxWidth: "75%",
    padding: "12px",
    borderRadius: "16px"
  },

  top: {
    display: "flex",
    justifyContent:
      "space-between",
    marginBottom: "5px",
    fontSize: "11px",
    opacity: 0.7
  },

  inputArea: {
    display: "flex",
    gap: "10px",
    padding: "16px",
    borderTop:
      "1px solid rgba(255,255,255,.08)"
  },

  messageInput: {
    flex: 1,
    background: "#121212",
    border:
      "1px solid rgba(255,255,255,.08)",
    borderRadius: "14px",
    padding: "14px",
    color: "#fff",
    outline: "none"
  },

  sendBtn: {
    background: "#00ffd5",
    border: "none",
    color: "#000",
    padding: "14px 18px",
    borderRadius: "14px",
    cursor: "pointer",
    fontWeight: "bold"
  }
}