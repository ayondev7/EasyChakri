"use client"

import { createContext, useContext, useEffect, useState, ReactNode } from "react"
import { io, Socket } from "socket.io-client"
import { useSession } from "next-auth/react"

interface SocketContextType {
  socket: Socket | null
  isConnected: boolean
}

const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
})

export const useSocket = () => useContext(SocketContext)

interface SocketProviderProps {
  children: ReactNode
}

export function SocketProvider({ children }: SocketProviderProps) {
  const [socket, setSocket] = useState<Socket | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const { data: session, status } = useSession()

  useEffect(() => {
    if (status === "authenticated" && session) {
      const token = (session as any).accessToken
      
      if (!token) return

      const socketInstance = io(process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000", {
        auth: {
          token: token,
        },
        autoConnect: true,
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
        reconnectionAttempts: Infinity,
      })

      socketInstance.on("connect", () => {
        setIsConnected(true)
      })

      socketInstance.on("disconnect", () => {
        setIsConnected(false)
      })

      socketInstance.on("connected", (data) => {
        console.log("Socket connected:", data)
      })

      setSocket(socketInstance)

      return () => {
        socketInstance.disconnect()
        setSocket(null)
        setIsConnected(false)
      }
    }
  }, [session, status])

  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  )
}
