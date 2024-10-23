"use client"

import { useState } from 'react'
import { User as UserIcon, Shield, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { removeMemberFromStudyGroup, toggleAdminStatus } from '@/actions/study-groups'
import { useToast } from '@/hooks/use-toast'
import { StudyGroupMember, User } from '@prisma/client'

export function MembersList({ members, studyGroupId }: { members: (StudyGroupMember & {user: User})[], studyGroupId: string }) {
  const [isLoading, setIsLoading] = useState(false)
  const {toast} = useToast()

  const handleRemoveMember = async (memberId: string) => {
    setIsLoading(true)
    try {
      await removeMemberFromStudyGroup(studyGroupId, memberId)
      toast({
        title: "Member removed",
        description: "The member has been removed from the study group.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to remove member. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleToggleAdmin = async (memberId: string) => {
    setIsLoading(true)
    try {
      await toggleAdminStatus(studyGroupId, memberId)
      toast({
        title: "Admin status updated",
        description: "The member's admin status has been updated.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update admin status. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Members</h2>
      <ul className="space-y-2">
        {members.map((member) => (
          <li key={member.id} className="flex flex-col items-center justify-between p-2 bg-muted/40 rounded">
            <div className="flex items-center space-x-2">
              <UserIcon className="h-5 w-5" />
              <span>{member.user.email}</span>
              {member.isAdmin && <Shield className="h-4 w-4 text-blue-500" />}
            </div>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleToggleAdmin(member.id)}
                disabled={isLoading}
              >
                {member.isAdmin ? "Remove Admin" : "Make Admin"}
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => handleRemoveMember(member.id)}
                disabled={isLoading}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}