import { ChatLayout } from '../_components/chat-layout'

export default function ChatPage({ params }: { params: { chatId: string } }) {
  return <ChatLayout chatId={params.chatId} />
}