"use client"

import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { ServiceCard } from './service-card'
import { Skeleton } from "@/components/ui/skeleton"
import { prisma } from '@/prisma/connection'
import { useCurrentUser } from '@/hooks/use-current-user'
import { Service } from '@prisma/client'

export const MatchedServices = ({allServices}: {allServices: Service[]}) => {
  const [services, setServices] = useState<Service[]>([])
  const searchParams = useSearchParams()
  const user = useCurrentUser()


  useEffect(() => {
    setServices(allServices)
    const category = searchParams.get("category")
    const mine = searchParams.get("mine")
    if (category) {
      setServices(services.filter(service=>service.category.includes(category)))
    }
    if (mine==="true") {
      setServices(services.filter(service=>service.providerId===user!.id!))
    }
  }, [searchParams])

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
      {services.map((service) => (
        <ServiceCard key={service.id} service={service} />
      ))}
    </div>
  )
}