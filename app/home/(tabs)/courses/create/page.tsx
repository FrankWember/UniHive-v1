import React from 'react'
import { CreateCourseForm } from './_components/create-course-form'
import { RoleGate } from '@/components/role-gate'
import { UserRole } from '@prisma/client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

const CreateCoursePage = () => {
  return (
    // <RoleGate allowedRoles={[UserRole.ADMIN]}>
      <div className="flex flex-col min-h-screen w-full">
        {/* Header */}
        <div className="flex items-center justify-between h-14 w-full border-b py-2 px-6 fixed top-0 backdrop-blur-sm z-50 bg-background/80">
          <h1 className="text-2xl font-bold">Create Course</h1>
        </div>

        {/* Content */}
        <div className="flex w-full h-full mt-20 px-6 items-center">
          <Card className="max-w-md mx-4">
            <CardHeader>
              <CardTitle>Create a Course</CardTitle>
              <CardDescription>Add a course that is frequently used and enrolled by students.</CardDescription>
            </CardHeader>
            <CardContent>
              <CreateCourseForm />
            </CardContent>
          </Card>
        </div>
      </div>
    // </RoleGate>
  )
}

export default CreateCoursePage