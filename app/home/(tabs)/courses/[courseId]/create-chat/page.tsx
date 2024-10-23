import React from 'react'
import { CreateChatForm } from './_components/create-chat-form'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BackButton } from '@/components/back-button'
import { getCourseUsers } from '@/utils/data/courses'

const CreateChatPage = async ({ params }: { params: { courseId: string } }) => {
  const users = await getCourseUsers(params.courseId)

  return (
    <div className="flex flex-col min-h-screen w-full">
      {/* Header */}
      <div className="flex items-center h-14 w-full border-b py-2 px-6 fixed top-0 backdrop-blur-sm z-50 bg-background/80">
        <BackButton />
        <h1 className="text-2xl font-bold ml-4">Create Group Chat</h1>
      </div>

      {/* Content */}
      <div className="flex-grow flex items-center justify-center px-4 mt-20">
        <Card className="w-full max-w-2xl">
          <CardHeader>
            <CardTitle>Create New Group Chat</CardTitle>
          </CardHeader>
          <CardContent>
            <CreateChatForm courseId={params.courseId} users={users} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default CreateChatPage