"use client"

import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { joinStudyGroup } from '@/actions/study-groups'
import { StudyGroup, StudyGroupMember, User } from '@prisma/client'
import { useCurrentUser } from '@/hooks/use-current-user'
import { useToast } from '@/hooks/use-toast'
import { CreateStudyGroupDialog } from './create-study-group-dialog'
import { StudyGroupSearchBar } from './study-group-search-bar'
import Link from 'next/link'

interface StudyGroupWrapperProps {
  initialStudyGroups: (StudyGroup & { members: (StudyGroupMember & { user: User })[] })[],
  courseId: string,
}

export const StudyGroupWrapper: React.FC<StudyGroupWrapperProps> = ({ initialStudyGroups, courseId }) => {
  const [studyGroups, setStudyGroups] = useState(initialStudyGroups)
  const currentUserId = useCurrentUser()?.id!
  const {toast} = useToast()

  const handleJoinGroup = async (groupId: string) => {
    try {
      const updatedGroup = await joinStudyGroup(groupId)
      setStudyGroups(studyGroups.map(group => 
        group.id === updatedGroup.id ? updatedGroup : group
      ))
      toast({
        title: "Request sent!",
        description: "Wait for the group admin to approve your request."
      })
    } catch (error) {
      console.error('Error joining study group:', error)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Study Groups</h2>
        <div className="flex space-x-2">
          <StudyGroupSearchBar studyGroups={studyGroups}/>
          <CreateStudyGroupDialog courseId={courseId} />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {studyGroups.map((group) => (
          <Card key={group.id}>
            <CardHeader>
              <CardTitle>{group.name}</CardTitle>
              <CardDescription>{group.members.length} members</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2 mb-4">
                {group.members.slice(0, 5).map((member) => (
                  <Avatar key={member.id}>
                    <AvatarImage src={member.user.image || undefined} alt={member.user.name || ''} />
                    <AvatarFallback>{member.user.name?.charAt(0) || '?'}</AvatarFallback>
                  </Avatar>
                ))}
                {group.members.length > 5 && (
                  <Avatar>
                    <AvatarFallback>+{group.members.length - 5}</AvatarFallback>
                  </Avatar>
                )}
              </div>
              <div className="flex gap-3">
                {group.members.some(member => member.userId === currentUserId) ? (
                  <Link href={`/home/courses/${courseId}/study-group/${group.id}`}><Button>Open</Button></Link>
                ):(
                  <Button onClick={() => handleJoinGroup(group.id)}>Join Group</Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}