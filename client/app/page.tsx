"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"

export default function Home() {
  const router = useRouter()

  const [roomCode, setRoomCode] =
    useState("")

  const createRoom = () => {
    const code = Math.random()
      .toString(36)
      .slice(2, 8)
      .toUpperCase()

    router.push("/chat/" + code)
  }

  const joinRoom = () => {
    if (!roomCode.trim()) return

    router.push(
      "/chat/" + roomCode
    )
  }

  return (
    <div style={styles.app}>
      <div style={styles.card}>
        <h1 style={styles.logo}>
          Zenith
        </h1>

        <p style={styles.subtitle}>
          Private Realtime Chat
        </p>

        <input
          style={styles.input}
          placeholder="Enter room code..."
          value={roomCode}
          onChange={(e) =>
            setRoomCode(
              e.target.value
            )
          }
        />

        <button
          style={styles.joinBtn}
          onClick={joinRoom}
        >
          Join Room
        </button>

        <button
          style={styles.createBtn}
          onClick={createRoom}
        >
          Create Room
        </button>
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

  card: {
    width: "400px",
    background: "#0b0b0b",
    padding: "30px",
    borderRadius: "24px",
    display: "flex",
    flexDirection: "column",
    gap: "14px",
    border:
      "1px solid rgba(0,255,213,.15)"
  },

  logo: {
    color: "#00ffd5",
    textAlign: "center",
    fontSize: "42px",
    margin: 0
  },

  subtitle: {
    textAlign: "center",
    color: "#777"
  },

  input: {
    padding: "15px",
    background: "#111",
    border:
      "1px solid rgba(255,255,255,.08)",
    borderRadius: "14px",
    color: "#fff",
    outline: "none"
  },

  joinBtn: {
    padding: "15px",
    background: "#00ffd5",
    color: "#000",
    border: "none",
    borderRadius: "14px",
    fontWeight: "bold",
    cursor: "pointer"
  },

  createBtn: {
    padding: "15px",
    background: "#1a1a1a",
    color: "#fff",
    border:
      "1px solid rgba(255,255,255,.08)",
    borderRadius: "14px",
    cursor: "pointer"
  }
}