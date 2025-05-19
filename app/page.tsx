"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { SocialLinks } from "@/components/social-links"
import { Button } from "@/components/ui/button"
import { TalkIcon, ListenIcon, ChatIcon } from "@/components/icons"
import { generateUsername } from "@/lib/username-generator"
import { io } from "socket.io-client"

export default function Home() {
  const router = useRouter()
  const [onlineCount, setOnlineCount] = useState(0)
  const socketRef = useRef<any>(null)
  const [selectedRole, setSelectedRole] = useState<string | null>(null)
  const [isBoxOpen, setIsBoxOpen] = useState(false)

  const handleRoleSelect = (role: string) => {
    setSelectedRole(role)
  }

  useEffect(() => {
    const socket = io("/api/socket", {
      path: "/api/socket",
    })

    socketRef.current = socket

    socket.on("connect", () => {
      console.log("Connected to socket server")
    })

    socket.on("online-count", (count: number) => {
      setOnlineCount(count)
    })

    return () => {
      socket.disconnect()
    }
  }, [])

  const handleFindMatch = async () => {
    if (!selectedRole) return
    const username = await generateUsername()

    localStorage.setItem("userRole", selectedRole)
    localStorage.setItem("username", username)

    router.push(`/chat?role=${selectedRole}&username=${username}&onlineCount=${onlineCount}`)
  }

  return (
    <div className="flex min-h-screen bg-[#E8D8C3] text-foreground">
      {/* Left Ad Space */}
      <div className="hidden lg:flex items-center justify-center">
        <div className="w-60 h-[60%] bg-[#8E5A58] mx-4 rounded-xl" />
      </div>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-[25%] min-w-[300px] space-y-8">
          <div className="text-center space-y-2">
            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl font-bold tracking-tight font-poppins"
            >
              BlahBlahBox
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-gray-600"
            >
              Vent. Listen. Let It Go.
            </motion.p>
          </div>

          <div className="space-y-4">
            <AnimatePresence mode="wait">
              {/* Talk Option */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: 0.1 }}
                className="flex justify-between items-center group"
              >
                <button
                  onClick={() => handleRoleSelect("venter")}
                  className={`
                    w-full flex items-center gap-3 px-6 py-4 rounded-2xl
                    bg-[#ECDFCF] text-[#1B221D] transition-all duration-200
                    shadow-[0_2px_4px_rgba(0,0,0,0.15)]
                    hover:bg-[#1B221D] hover:text-white
                    hover:shadow-[inset_0_4px_4px_rgba(0,0,0,1)]
                    ${selectedRole === "venter" ? "bg-foreground text-white shadow-[inset_0_4px_4px_rgba(0,0,0,1)]" : ""}
                  `}
                >
                  <TalkIcon />
                  <span className="font-medium">Talk</span>
                  <span className="ml-auto text-sm text-[#606060] group-hover:text-[#D4D4D4] group-active:text-[#D4D4D4]">
                    Share Your Thoughts
                  </span>
                </button>
              </motion.div>

              {/* Listen Option */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: 0.2 }}
                className="flex justify-between items-center group"
              >
                <button
                  onClick={() => handleRoleSelect("listener")}
                  className={`
                    w-full flex items-center gap-3 px-6 py-4 rounded-2xl
                    bg-[#ECDFCF] text-[#1B221D] transition-all duration-200
                    shadow-[0_2px_4px_rgba(0,0,0,0.15)]
                    hover:bg-[#1B221D] hover:text-white
                    hover:shadow-[inset_0_4px_4px_rgba(0,0,0,1)]
                    ${selectedRole === "listener" ? "bg-foreground text-white shadow-[inset_0_4px_4px_rgba(0,0,0,1)]" : ""}
                  `}
                >
                  <ListenIcon />
                  <span className="font-medium">Listen</span>
                  <span className="ml-auto text-sm text-[#606060] group-hover:text-[#D4D4D4] group-active:text-[#D4D4D4]">
                    Lend An Ear
                  </span>
                </button>
              </motion.div>

              {/* Chat Option */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: 0.3 }}
                className="flex justify-between items-center group"
              >
                <button
                  onClick={() => handleRoleSelect("chat")}
                  className={`
                    w-full flex items-center gap-3 px-6 py-4 rounded-2xl
                    bg-[#ECDFCF] text-[#1B221D] transition-all duration-200
                    shadow-[0_2px_4px_rgba(0,0,0,0.15)]
                    hover:bg-[#1B221D] hover:text-white
                    ${selectedRole === "chat" ? "bg-foreground text-white" : ""}
                  `}
                >
                  <ChatIcon />
                  <span className="font-medium">Chat</span>
                  <span className="ml-auto text-sm text-[#606060] group-hover:text-[#D4D4D4] group-active:text-[#D4D4D4]">
                    Casual, No-Pressure Talk
                  </span>
                </button>
              </motion.div>
            </AnimatePresence>

            {/* Match Now Button */}
            {selectedRole && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-8"
              >
                <Button
                  className="w-full bg-primary hover:bg-primary/90 text-white h-12 rounded-full font-inter"
                  onClick={handleFindMatch}
                >
                  Match Now
                </Button>
              </motion.div>
            )}
          </div>

          {/* Footer Message */}
          <motion.div
            className="text-center space-y-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <p className="text-gray-600 text-sm">No Data Stored. No History. Just Conversation.</p>
            <div className="flex items-center justify-center gap-2">
              <div className="w-2 h-2 rounded-full bg-primary" />
              <p className="text-gray-500 text-sm">
                {onlineCount === 1 ? "Person" : `${onlineCount} People`} Online
              </p>
            </div>
          </motion.div>
        </div>

        <SocialLinks isOpen={isBoxOpen} setIsOpen={setIsBoxOpen} />
      </main>

      {/* Right Ad Space */}
      <div className="hidden lg:flex items-center justify-center">
        <div className="w-60 h-[60%] bg-[#8E5A58] mx-4 rounded-xl" />
      </div>
    </div>
  )
}


