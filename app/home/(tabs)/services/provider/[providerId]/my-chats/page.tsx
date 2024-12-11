"use client"

import { BackButton } from "@/components/back-button"
import { useParams } from "next/navigation"
import { ChatsList } from "./_components/chats-list"
import { useState } from "react"
import ChatInterface from "./_components/chat-interface"
import { useCurrentUser } from "@/hooks/use-current-user"
import { Id } from "@/convex/_generated/dataModel"

const ProviderChatPage = () => {
  const { providerId } = useParams<{ providerId: string }>()
  const [currentChatId, setCurrentChatId] = useState<Id<"chats">|null>(null)

  return (
    <div className="flex flex-col min-h-screen w-screen">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 h-14 w-full border-b py-2 px-6 fixed top-0 backdrop-blur-sm z-50 bg-background/80">
        <div className="flex items-center gap-3">
          <BackButton />
          <h1 className="text-2xl font-bold">Chats</h1>
        </div>
        <ChatsList 
          currentChatId={currentChatId} 
          setCurrentChatId={setCurrentChatId} 
          sellerId={providerId}
        />
      </div>

      {/* Content */}
      <div className="flex w-screen h-full justify-center pt-24">
        <ChatInterface 
          currentChatId={currentChatId} 
          setCurrentChatId={setCurrentChatId} 
          providerId={providerId} 
        />
      </div>
    </div>
  )
}

export default ProviderChatPage