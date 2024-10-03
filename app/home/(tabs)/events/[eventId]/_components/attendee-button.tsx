"use client"

import React from 'react'
import { Button } from "@/components/ui/button"
import { useCurrentUser } from '@/hooks/use-current-user'
import { addAttendee, removeAttendee, isUserAttending } from '@/actions/events'
import { useRouter } from 'next/navigation'

interface AttendeeButtonProps {
  eventId: string
}

export const AttendeeButton: React.FC<AttendeeButtonProps> = ({ eventId }) => {
  const [isAttending, setIsAttending] = React.useState(false)
  const [isLoading, setIsLoading] = React.useState(false)
  const currentUser = useCurrentUser()
  const router = useRouter()

  React.useEffect(() => {
    if (currentUser) {
      isUserAttending(eventId, currentUser.id!).then(setIsAttending)
    }
  }, [eventId, currentUser])

  const handleAttendeeAction = async () => {
    if (!currentUser) {
      router.push('/auth/sign-in')
      return
    }

    setIsLoading(true)
    try {
      if (isAttending) {
        await removeAttendee(eventId, currentUser.id!)
      } else {
        await addAttendee(eventId, currentUser.id!)
      }
      setIsAttending(!isAttending)
      router.refresh()
    } catch (error) {
      console.error('Error updating attendee status:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button onClick={handleAttendeeAction} disabled={isLoading}>
      {isAttending ? 'Cancel Attendance' : 'Attend Event'}
    </Button>
  )
}