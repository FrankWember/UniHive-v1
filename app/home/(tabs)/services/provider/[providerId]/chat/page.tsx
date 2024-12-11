import { redirect } from "next/navigation"
import { getProviderById } from "@/utils/data/services"
import { ChatInterface } from "./_components/chat-interface"
import { BackButton } from "@/components/back-button"
import { currentUser } from "@/lib/auth"

export default async function ChatPage({ params }: { params: { providerId: string } }) {
  const user = await currentUser()

  if (!user) {
    redirect("/auth/sign-in")
  }

  const provider = await getProviderById(params.providerId)

  if (!provider) {
    redirect("/home/services")
  }

  return (
    <div className="flex flex-col min-h-screen w-screen overflow-hidden overscroll-none">
      {/* Header */}
      <div className="flex items-center justify-start gap-3 h-14 w-full border-b py-2 px-6 fixed top-0 backdrop-blur-sm z-50 bg-background/80">
        <BackButton />
        <h1 className="text-xl font-bold">Chat with {provider.name}</h1>
      </div>

      {/* Content */}
      <div className="flex w-screen h-screen justify-center pt-24">
        <ChatInterface userId={user.id!} providerId={provider.id} />
      </div>
    </div>
  )
}