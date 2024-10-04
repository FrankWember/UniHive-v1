import React from 'react'
import { CreateCourseForm } from './_components/create-course-form'
import { RoleGate } from '@/components/role-gate'
import { UserRole } from '@prisma/client'

const CreateCoursePage = () => {
  return (
    <RoleGate allowedRoles={[UserRole.ADMIN]}>
      <div className="flex flex-col min-h-screen w-full">
        {/* Header */}
        <div className="flex items-center justify-between h-14 w-full border-b py-2 px-6 fixed top-0 backdrop-blur-sm z-50 bg-background/80">
          <h1 className="text-2xl font-bold">Create Course</h1>
        </div>

        {/* Content */}
        <div className="w-full mt-20 px-6">
          <CreateCourseForm />
        </div>
      </div>
    </RoleGate>
  )
}

export default CreateCoursePage