"use client"

import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { ServiceCard } from './service-card'
import { Skeleton } from "@/components/ui/skeleton"
import { prisma } from '@/prisma/connection'
import { useCurrentUser } from '@/hooks/use-current-user'
import { Service } from '@prisma/client'

export const MatchedServices = () => {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const searchParams = useSearchParams()
  const user = useCurrentUser()

  useEffect(() => {
    const fetchServices = async () => {
      setLoading(true)
      const category = searchParams.get('category')
      const mine = searchParams.get('mine')

      try {
        let query = {}
        if (category) {
          query = { where: { category: { has: category } } }
        }
        if (mine === 'true') {
          query = { ...query, where: { providerId: user?.id } }
        }

        const fetchedServices = await prisma.service.findMany(query)
        setServices(fetchedServices)
      } catch (error) {
        console.error('Error fetching services:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchServices()
  }, [searchParams])

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
        {[...Array(6)].map((_, index) => (
          <Skeleton key={index} className="h-[300px] w-full rounded-lg" />
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
      {services.map((service) => (
        <ServiceCard key={service.id} service={service} />
      ))}
    </div>
  )
}