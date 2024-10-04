import React, { Suspense } from 'react'
import { CourseList } from './_components/course-list'
import { SearchBar } from './_components/search-bar'
import { Skeleton } from "@/components/ui/skeleton"
import { RoleGate } from '@/components/role-gate'
import { UserRole } from '@prisma/client'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { PlusCircle } from 'lucide-react'
import { getCourses } from '@/actions/courses'

const CoursesPage = async () => {
  const courses = await getCourses()

  return (
    <div className="flex flex-col min-h-screen w-full">
      {/* Header */}
      <div className="flex items-center justify-between h-14 w-full border-b py-2 px-6 fixed top-0 backdrop-blur-sm z-50 bg-background/80">
        <h1 className="text-2xl font-bold">Courses</h1>
        <div className="flex items-center space-x-3">
          <SearchBar courses={courses} />
          <RoleGate allowedRoles={[UserRole.ADMIN]}>
            <Link href="/home/courses/create-course" passHref>
              <Button size="sm">
                <PlusCircle className="mr-2 h-4 w-4" />
                Create Course
              </Button>
            </Link>
          </RoleGate>
        </div>
      </div>

      {/* Content */}
      <div className="w-full mt-20 px-6">
        <Suspense fallback={<Skeleton className="w-full h-96" />}>
          <CourseList courses={courses} />
        </Suspense>
      </div>
    </div>
  )
}

export default CoursesPage