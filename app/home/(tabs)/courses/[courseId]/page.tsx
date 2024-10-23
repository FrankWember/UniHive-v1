import React from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AssignmentsWrapper } from './_components/assignments-wrapper'
import { StudyGroupWrapper } from './_components/study-group-wrapper.tsx'
import { getCourseById } from '@/utils/data/courses'
import { getAssignments } from '@/utils/data/assignments'
import { getStudyGroups } from '@/utils/data/study-groups'
import { notFound } from 'next/navigation'
import { BackButton } from '@/components/back-button'

const CoursesPage = async ({ params }: { params: { courseId: string } }) => {
  const course = await getCourseById(params.courseId)
  const assignments = await getAssignments(params.courseId)
  const studyGroups = await getStudyGroups(params.courseId)

  if (!course) {
    notFound()
  }

  return (
    <div className="flex flex-col min-h-screen w-full">
      {/* Header */}
      <div className="flex items-center h-14 w-full border-b py-2 px-6 fixed top-0 backdrop-blur-sm z-50 bg-background/80">
        <BackButton />
        <h1 className="text-2xl font-bold ml-4">{course.title} Study Group</h1>
      </div>

      {/* Content */}
      <div className="w-full mt-20 px-6">
        <Tabs defaultValue="assignments" className="w-full">
          <TabsList className="grid grid-cols-2 w-full">
            <TabsTrigger value="assignments">Assignments</TabsTrigger>
            <TabsTrigger value="study-groups">Study Groups</TabsTrigger>
          </TabsList>
          <TabsContent value="assignments">
            <AssignmentsWrapper initialAssignments={assignments} courseId={course.id} />
          </TabsContent>
          <TabsContent value="study-groups">
            <StudyGroupWrapper initialStudyGroups={studyGroups} courseId={course.id} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export default CoursesPage