import React from 'react'
import { ServiceHeader } from '../_components/service-header'
import { Suspense } from 'react'
import { Skeleton } from '@/components/ui/skeleton'
import { getServiceById } from '@/utils/data/services'
import { currentUser } from '@/lib/auth'
import { notFound } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { PortfolioForm } from './_components/portfolio-form'

const PortfolioPage = async ({ params }: { params: { serviceId: string } }) => {
  const service = await getServiceById(params.serviceId)
  const user = await currentUser()
  if (!service) {
    notFound()
  }
  return (
    <div className="flex flex-col min-h-screen w-full">
      <ServiceHeader user={user} service={service} />
      {/* Content */}
      <div className="flex flex-col md:mt-[5.7rem] pb-24 justify-center items-center">
        <Card>
            <CardHeader>
                <CardTitle>Portfolio</CardTitle>
                <CardDescription>These are you works from this service: {service.name}</CardDescription>
            </CardHeader>
            <CardContent>
                <Suspense fallback={<Skeleton className="w-full h-[600px]" />}>
                    <PortfolioForm service={service} />
                </Suspense>
            </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default PortfolioPage