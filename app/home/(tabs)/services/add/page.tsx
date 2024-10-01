import React from 'react'
import { AddServiceForm } from './_components/add-service-form'

const AddServicePage = () => {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Add a New Service</h1>
      <AddServiceForm />
    </div>
  )
}

export default AddServicePage