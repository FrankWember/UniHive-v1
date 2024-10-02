import React from 'react'
import { AddServiceForm } from './_components/add-service-form'
import { BackButton } from '@/components/back-button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'


const AddServicePage = () => {
  return (
    <div className="flex flex-col min-h-screen w-screen">
      {/* Header */}
      <div className="flex items-center justify-start gap-3 h-14 w-full border-b py-2 px-6 fixed top-0 backdrop-blur-sm z-50 bg-background/80">
        <BackButton />
        <h1 className="text-2xl font-bold">Create Service</h1>
      </div>

      {/* Content */}
      <div className="flex w-screen justify-center">
        <Card className='max-w-md h-fit my-20 mx-2'>
          <CardHeader>
            <CardTitle>Create Service</CardTitle>
            <CardDescription>Create a new service to sell or offer</CardDescription>
          </CardHeader>
          <CardContent>
            <AddServiceForm />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default AddServicePage