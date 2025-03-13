"use client"

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
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
import { ArrowDownNarrowWide, ChevronsUpDown, Filter } from 'lucide-react'
import { useServices } from '@/contexts/services-context'

export const FiltersSection = () => {
    const { providerFilter, sortOption, setProviderFilter, setSortOption, isMobileFilter, setIsMobileFilter, locationFilter, setLocationFilter, priceRangeFilter, setPriceRangeFilter } = useServices()
  return (
    <div className="flex gap-4 p-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon" className="bg-muted">
                <Filter className="h-4 w-4" />
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
            <Button variant="outline" size="icon" className="bg-muted">
                <ArrowDownNarrowWide className="h-4 w-4" />
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
  )
}
