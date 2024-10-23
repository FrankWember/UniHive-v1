import React from 'react'
import { UploadAssignmentForm } from './_components/upload-assignment-form'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BackButton } from '@/components/back-button'

const UploadAssignmentPage = ({ params }: { params: { courseId: string } }) => {
  return (
    <div className="flex flex-col min-h-screen w-full">
      {/* Header */}
      <div className="flex items-center h-14 w-full border-b py-2 px-6 fixed top-0 backdrop-blur-sm z-50 bg-background/80">
        <BackButton />
        <h1 className="text-2xl font-bold ml-4">Upload Assignment</h1>
      </div>

      {/* Content */}
      <div className="flex-grow flex items-center justify-center px-4 mt-20">
        <Card className="w-full max-w-2xl">
          <CardHeader>
            <CardTitle>Upload New Assignment</CardTitle>
          </CardHeader>
          <CardContent>
            <UploadAssignmentForm courseId={params.courseId} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default UploadAssignmentPage