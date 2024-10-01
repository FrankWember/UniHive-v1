import React from 'react'
import { AddServiceForm } from './_components/add-service-form'
import { BackButton } from '@/components/back-button'

const AddServicePage = () => {
  return (
    <div className="flex flex-col min-h-screen w-full">
      {/* Header */}
      <div className="flex items-center justify-start h-14 w-full border-b py-2 px-6 fixed top-0 backdrop-blur-sm z-50 bg-background/80">
        <BackButton />
        <h1 className="text-2xl font-bold">Create Service</h1>
      </div>

      {/* Content */}
      <div className="w-full mt-20">
        <AddServiceForm />
      </div>
    </div>
  )
}

export default AddServicePage