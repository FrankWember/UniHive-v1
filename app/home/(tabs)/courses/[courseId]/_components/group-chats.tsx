import React from 'react'
import { getGroupChats } from '@/actions/chats'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from 'next/link'
import { MessageCircleIcon, PlusCircleIcon } from 'lucide-react'

interface GroupChatsProps {
  courseId: string
}

export const GroupChats: React.FC<GroupChatsProps> = async ({ courseId }) => {
  const chats = await getGroupChats(courseId)

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Group Chats</h2>
        <Button asChild>
          <Link href={`/home/courses/${courseId}/create-chat`}>
            <PlusCircleIcon className="mr-2 h-4 w-4" />
            Create New Chat
          </Link>
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {chats.map((chat) => (
          <Card key={chat.id}>
            <CardHeader>
              <CardTitle>{chat.name}</CardTitle>
              <CardDescription>Participants: {chat.participants.length}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild>
                <Link href={`/home/courses/${courseId}/chats/${chat.id}`}>
                  <MessageCircleIcon className="mr-2 h-4 w-4" />
                  Join Chat
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}