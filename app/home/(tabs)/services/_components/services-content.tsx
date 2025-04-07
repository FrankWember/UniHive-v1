"use client"

import React, { useState } from 'react'
import { ServiceCard } from './service-card'
import { Service, ServiceReview, User } from '@prisma/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { calculateServiceReviewMetrics } from '@/utils/helpers/reviews'
import { ArrowDownNarrowWide, ChevronsUpDown, Filter } from 'lucide-react'
import { useServices } from '@/contexts/services-context'
import { useIsMobile } from '@/hooks/use-mobile'
import { FiltersSection } from './filters-section'

type ServiceProps = Service & { 
  reviews: ServiceReview[], 
  provider: User,
  offers: ({
    bookings: ({
      customer: {
        image: string|null
      }
    })[]
  })[]
}

export const ServicesContent = ({ services }: { services: ServiceProps[] }) => {
  const isMobile = useIsMobile()
  
  const { providerFilter, sortOption, setProviderFilter, setSortOption, isMobileFilter, setIsMobileFilter, locationFilter, setLocationFilter, priceRangeFilter, setPriceRangeFilter } = useServices()

  const filteredServices = services.filter(service => 
    (providerFilter ? (service.provider.name || service.provider.email).toLowerCase().includes(providerFilter.toLowerCase()) : true) &&
    (isMobileFilter ? service.isMobileService : true) &&
    (locationFilter ? service.defaultLocation?.toLowerCase().includes(locationFilter.toLowerCase()) : true) &&
    (service.price >= priceRangeFilter.min && service.price <= priceRangeFilter.max)
  )

  const sortedServices = [...filteredServices].sort((a, b) => {
    switch (sortOption) {
      case 'priceAsc':
        return a.price - b.price
      case 'priceDesc':
        return b.price - a.price
      case 'topRated':
        let aRating = calculateServiceReviewMetrics(a.reviews)?.overall || 0
        let bRating = calculateServiceReviewMetrics(b.reviews)?.overall || 0
        return bRating - aRating
      case 'activeUsers':
        return b.offers.reduce((acc, offer) => acc + offer.bookings.length, 0) -
               a.offers.reduce((acc, offer) => acc + offer.bookings.length, 0)
      default:
        return a.name.localeCompare(b.name)
    }
  })

  return (
    <div className="flex flex-col gap-4">
      {isMobile && <FiltersSection />}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-2 gap-y-8 md:gap-5 px-3 py-4">
        {sortedServices.map((service) => (
          <ServiceCard key={service.id} service={service} />
        ))}
      </div>
    </div>
  )
}