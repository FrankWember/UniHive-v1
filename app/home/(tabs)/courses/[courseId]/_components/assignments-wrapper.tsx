"use client"

import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from 'next/link'
import { FileIcon, UploadIcon, ThumbsUp, ThumbsDown } from 'lucide-react'
import { voteAssignment } from '@/actions/assignments'
import { Assignment, User, AssignmentVote } from '@prisma/client'

interface AssignmentsWrapperProps {
  initialAssignments: (Assignment & {uploader: User, votes: AssignmentVote[]})[],
  courseId: string
}

export const AssignmentsWrapper: React.FC<AssignmentsWrapperProps> = ({ initialAssignments, courseId }) => {
  const [assignments, setAssignments] = useState(initialAssignments)

  const handleVote = async (assignmentId: string, value: number) => {
    try {
      const updatedAssignment = await voteAssignment(courseId, assignmentId, value)
      setAssignments(prev => prev.map(assignment => 
        assignment.id === assignmentId ? { ...assignment, votes: updatedAssignment!.votes } : assignment
      ))
    } catch (error) {
      console.error('Error voting on assignment:', error)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Assignments</h2>
        <Button asChild>
          <Link href={`/home/courses/${courseId}/upload-assignment`}>
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
              <div className="flex justify-between items-center">
                <Button asChild variant="outline">
                  <a href={assignment.filePath} target="_blank" rel="noopener noreferrer">
                    <FileIcon className="mr-2 h-4 w-4" />
                    View File
                  </a>
                </Button>
                <div className="flex items-center space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleVote(assignment.id, 1)}
                  >
                    <ThumbsUp className="h-4 w-4" />
                    <span className="ml-1">{assignment.votes.filter(v => v.value === 1).length}</span>
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleVote(assignment.id, -1)}
                  >
                    <ThumbsDown className="h-4 w-4" />
                    <span className="ml-1">{assignment.votes.filter(v => v.value === -1).length}</span>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}