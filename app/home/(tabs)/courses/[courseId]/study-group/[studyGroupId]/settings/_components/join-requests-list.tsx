"use client"

import { useState } from 'react'
import { UserIcon, Check, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { approveJoinRequest, rejectJoinRequest } from '@/actions/study-groups'
import { useToast } from '@/hooks/use-toast'
import { StudyGroupMember, User } from '@prisma/client'

export function JoinRequestsList({ studyGroupId, initialJoinRequests }: { studyGroupId: string, initialJoinRequests: (StudyGroupMember & {user: User})[] }) {
  const [joinRequests, setJoinRequests] = useState(initialJoinRequests)
  const [isLoading, setIsLoading] = useState(false)
  const {toast} = useToast()

  const handleApproveRequest = async (memberId: string) => {
    setIsLoading(true)
    try {
      await approveJoinRequest(studyGroupId, memberId)
      setJoinRequests(joinRequests.filter(request => request.id !== memberId))
      toast({
        title: "Join request approved",
        description: "The user has been added to the study group.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to approve join request. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleRejectRequest = async (memberId: string) => {
    setIsLoading(true)
    try {
      await rejectJoinRequest(studyGroupId, memberId)
      setJoinRequests(joinRequests.filter(request => request.id !== memberId))
      toast({
        title: "Join request rejected",
        description: "The join request has been rejected.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to reject join request. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div>
      {joinRequests.length === 0 ? (
        <p>No pending join requests.</p>
      ) : (
        <ul className="space-y-2">
          {joinRequests.map((request) => (
            <li key={request.id} className="flex flex-col items-center justify-between p-2 bg-gray-100 rounded">
              <div className="flex items-center space-x-2">
                <UserIcon className="h-5 w-5" />
                <span>{request.user.email}</span>
              </div>
              <div className="space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleApproveRequest(request.id)}
                  disabled={isLoading}
                >
                  <Check className="h-4 w-4" />
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleRejectRequest(request.id)}
                  disabled={isLoading}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}