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
import { ChevronsUpDown } from 'lucide-react'

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
  const [providerFilter, setProviderFilter] = useState('')
  const [isMobileFilter, setIsMobileFilter] = useState(false)
  const [locationFilter, setLocationFilter] = useState('')
  const [priceRangeFilter, setPriceRangeFilter] = useState({ min: 0, max: Infinity })
  const [sortOption, setSortOption] = useState('newest')

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
      <div className="flex gap-4 p-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="flex gap-2 items-center bg-muted">
                Filters
                <ChevronsUpDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="">
            <DropdownMenuLabel>Filter Options</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <div className="p-2">
              <Label htmlFor="provider-filter">Provider Name</Label>
              <Input
                id="provider-filter"
                value={providerFilter}
                onChange={(e) => setProviderFilter(e.target.value)}
                placeholder="Filter by provider"
              />
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuCheckboxItem
              checked={isMobileFilter}
              onCheckedChange={setIsMobileFilter}
            >
              Mobile Services Only
            </DropdownMenuCheckboxItem>
            <DropdownMenuSeparator />
            <div className="p-2">
              <Label htmlFor="location-filter">Location</Label>
              <Input
                id="location-filter"
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
                placeholder="Filter by location"
              />
            </div>
            <DropdownMenuSeparator />
            <div className="p-2">
              <Label htmlFor="price-min">Price Range</Label>
              <div className="flex gap-2">
                <Input
                  id="price-min"
                  type="number"
                  placeholder="Min"
                  onChange={(e) => setPriceRangeFilter(prev => ({ ...prev, min: Number(e.target.value) }))}
                />
                <Input
                  id="price-max"
                  type="number"
                  placeholder="Max"
                  onChange={(e) => setPriceRangeFilter(prev => ({ ...prev, max: Number(e.target.value) || Infinity }))}
                />
              </div>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="flex gap-2 items-center bg-muted">
                Sorts
                <ChevronsUpDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="">
            <DropdownMenuLabel>Sort Options</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuRadioGroup value={sortOption} onValueChange={setSortOption}>
              <DropdownMenuRadioItem value="priceAsc">Price: Low to High</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="priceDesc">Price: High to Low</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="topRated">Top Rated</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="activeUsers">Most Active Users</DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2 gap-y-8 md:gap-5 px-3 py-6">
        {sortedServices.map((service) => (
          <ServiceCard key={service.id} service={service} />
        ))}
      </div>
    </div>
  )
}