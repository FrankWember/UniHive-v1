import React from 'react'
import { getCourses } from '@/actions/courses'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Course } from '@prisma/client'

export const CourseList = async ({courses}: {courses: Course[]}) => {

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {courses.map((course) => (
        <Card key={course.id}>
          <CardHeader>
            <CardTitle>{course.title}</CardTitle>
            <CardDescription>Course Code: {course.code}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <Link href={`/home/courses/${course.id}`}>
                View Study Group
              </Link>
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}