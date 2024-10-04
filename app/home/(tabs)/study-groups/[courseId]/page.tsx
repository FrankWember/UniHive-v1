import React, { Suspense } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Assignments } from './_components/assignments'
import { GroupChats } from './_components/group-chats'
import { getCourseById } from '@/actions/courses'
import { notFound } from 'next/navigation'
import { Skeleton } from "@/components/ui/skeleton"

const StudyGroupPage = async ({ params }: { params: { courseId: string } }) => {
  const course = await getCourseById(params.courseId)

  if (!course) {
    notFound()
  }

  return (
    <div className="flex flex-col min-h-screen w-full">
      {/* Header */}
      <div className="flex items-center justify-between h-14 w-full border-b py-2 px-6 fixed top-0 backdrop-blur-sm z-50 bg-background/80">
        <h1 className="text-2xl font-bold">{course.title} Study Group</h1>
      </div>

      {/* Content */}
      <div className="w-full mt-20 px-6">
        <Tabs defaultValue="assignments" className="w-full">
          <TabsList>
            <TabsTrigger value="assignments">Assignments</TabsTrigger>
            <TabsTrigger value="chats">Group Chats</TabsTrigger>
          </TabsList>
          <TabsContent value="assignments">
            <Suspense fallback={<Skeleton className="w-full h-96" />}>
              <Assignments courseId={course.id} />
            </Suspense>
          </TabsContent>
          <TabsContent value="chats">
            <Suspense fallback={<Skeleton className="w-full h-96" />}>
              <GroupChats courseId={course.id} />
            </Suspense>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export default StudyGroupPage