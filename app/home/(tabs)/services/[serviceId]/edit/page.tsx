import React from 'react'
import { notFound } from 'next/navigation'
import { EditServiceForm } from '@/app/home/(tabs)/services/[serviceId]/edit/_components/edit-service-form'
import { getServiceById } from '@/utils/data/services'
import { BackButton } from '@/components/back-button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { RoleGate } from '@/components/role-gate'
import { UserRole } from '@prisma/client'


const EditServicePage = async ({ params }: { params: { serviceId: string } }) => {
  const service = await getServiceById(params.serviceId)

  if (!service) {
    notFound()
  }

  return (
    <RoleGate allowedRoles={[UserRole.SELLER, UserRole.ADMIN]}>
      <div className="flex flex-col min-h-screen w-full">
        {/* Header */}
        <div className="flex items-center justify-start h-14 w-full border-b py-2 px-6 fixed top-0 backdrop-blur-sm z-50 bg-background/80">
          <BackButton />
          <h1 className="text-2xl font-bold">Edit Service: {service.name}</h1>
        </div>

        {/* Content */}
        <div className="flex w-screen justify-center mt-5">
          <Card className='max-w-[40rem] h-fit my-20 mx-2'>
            <CardHeader>
              <CardTitle>Edit Service</CardTitle>
              <CardDescription>Edit an existing service to sell or offer</CardDescription>
            </CardHeader>
            <CardContent>
              <EditServiceForm service={service} />
            </CardContent>
          </Card>
        </div>
      </div>
    </RoleGate>
  )
}

export default EditServicePage