import React from 'react'
import { getAssignments } from '@/actions/assignments'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from 'next/link'
import { FileIcon, UploadIcon } from 'lucide-react'

interface AssignmentsProps {
  courseId: string
}

export const Assignments: React.FC<AssignmentsProps> = async ({ courseId }) => {
  const assignments = await getAssignments(courseId)

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Assignments</h2>
        <Button asChild>
          <Link href={`/home/(tabs)/study-groups/${courseId}/upload-assignment`}>
            <UploadIcon className="mr-2 h-4 w-4" />
            Upload Assignment
          </Link>
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {assignments.map((assignment) => (
          <Card key={assignment.id}>
            <CardHeader>
              <CardTitle>{assignment.title}</CardTitle>
              <CardDescription>Uploaded by: {assignment.uploader.name}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-4">{assignment.description}</p>
              <Button asChild variant="outline">
                <a href={assignment.filePath} target="_blank" rel="noopener noreferrer">
                  <FileIcon className="mr-2 h-4 w-4" />
                  View File
                </a>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}