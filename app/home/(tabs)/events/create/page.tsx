import React from 'react'
import { CreateEventForm } from './_components/create-event-form'
import { RoleGate } from '@/components/role-gate'
import { UserRole } from '@prisma/client'
import { BackButton } from '@/components/back-button'
import { Card, CardHeader, CardContent, CardDescription, CardFooter, CardTitle } from '@/components/ui/card'

const CreateEventPage = () => {
  return (
      <div className="flex flex-col min-h-screen w-full">
        {/* Header */}
        <div className="flex items-center justify-start h-14 w-full border-b py-2 px-6 fixed top-0 backdrop-blur-sm z-50 bg-background/80">
          <BackButton />
          <h1 className="text-2xl font-bold">Create Event</h1>
        </div>

        {/* Content */}
        <div className="flex w-full px-6 justify-center">
          <Card className='max-w-md h-fit my-20 mx-2'>
            <CardHeader>
              <CardTitle>Create Event</CardTitle>
              <CardDescription>Create a new Campus event</CardDescription>
            </CardHeader>
            <CardContent>
              <CreateEventForm />
            </CardContent>
          </Card>
        </div>
      </div>
  )
}

export default CreateEventPage