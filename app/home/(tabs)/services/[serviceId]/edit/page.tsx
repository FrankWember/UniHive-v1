import React from 'react'
import { notFound } from 'next/navigation'
import { EditServiceForm } from '@/app/home/(tabs)/services/[serviceId]/edit/_components/edit-service-form'
import { getServiceById } from '@/utils/data/services'
import { BackButton } from '@/components/back-button'

const EditServicePage = async ({ params }: { params: { serviceId: string } }) => {
  const service = await getServiceById(params.serviceId)

  if (!service) {
    notFound()
  }

  return (
    <div className="flex flex-col min-h-screen w-full">
      {/* Header */}
      <div className="flex items-center justify-between h-14 w-full border-b py-2 px-6 fixed top-0 backdrop-blur-sm z-50 bg-background/80">
        <BackButton />
        <h1 className="text-2xl font-bold">Edit Service: {service.name}</h1>
      </div>

      {/* Content */}
      <div className="w-full mt-20">
        <EditServiceForm service={service} />
      </div>
    </div>
  )
}

export default EditServicePage