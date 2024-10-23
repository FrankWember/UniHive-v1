"use client"

import { useState } from 'react'
import { LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { leaveStudyGroup } from '@/actions/study-groups'
import { useRouter } from 'next/navigation'
import { useToast } from '@/hooks/use-toast'

export function ExitStudyGroupButton({ studyGroupId }: { studyGroupId: string }) {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const {toast} = useToast()

  const handleLeaveGroup = async () => {
    setIsLoading(true)
    try {
      await leaveStudyGroup(studyGroupId)
      toast({
        title: "Left study group",
        description: "You have successfully left the study group.",
      })
      router.push('/home/courses')
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to leave the study group. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" size="icon">
          <LogOut className="h-5 w-5" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure you want to leave this study group?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. You will need to request to join again if you change your mind.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleLeaveGroup} disabled={isLoading}>
            {isLoading ? "Leaving..." : "Leave Group"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}