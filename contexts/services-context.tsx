"use client"

import React, { createContext, useContext, useState, useEffect } from 'react'
import { User, Service as GeneralService, ServiceReview } from '@prisma/client'

type Service = GeneralService & {
  provider: User,
  reviews: ServiceReview[]
}

type ServicesContextType = {
  services: Service[]
  isLoading: boolean,
  providerFilter: string,
  sortOption: string,
  setProviderFilter: React.Dispatch<React.SetStateAction<string>>,
  setSortOption: React.Dispatch<React.SetStateAction<string>>,
  isMobileFilter: boolean,
  setIsMobileFilter: React.Dispatch<React.SetStateAction<boolean>>,
  locationFilter: string,
  setLocationFilter: React.Dispatch<React.SetStateAction<string>>,
  priceRangeFilter: { min: number, max: number },
  setPriceRangeFilter: React.Dispatch<React.SetStateAction<{
    min: number;
    max: number;
  }>>
}

const ServicesContext = createContext<ServicesContextType | undefined>(undefined)

export const ServicesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [services, setServices] = useState<Service[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [providerFilter, setProviderFilter] = useState('')
  const [sortOption, setSortOption] = useState('newest')
  const [isMobileFilter, setIsMobileFilter] = useState(false)
  const [locationFilter, setLocationFilter] = useState('')
  const [priceRangeFilter, setPriceRangeFilter] = useState({ min: 0, max: Infinity })

  useEffect(() => {
    const fetchServices = async () => {
      const response = await fetch('/api/services')
      const { services: fetchedServices } = await response.json()
      setServices(fetchedServices)
      setIsLoading(false)
    }

    fetchServices()
  }, [])

  return (
    <ServicesContext.Provider value={{ 
      services, 
      isLoading, 
      providerFilter, 
      sortOption, 
      setProviderFilter, 
      setSortOption,
      isMobileFilter, 
      setIsMobileFilter, 
      locationFilter, 
      setLocationFilter, 
      priceRangeFilter, 
      setPriceRangeFilter
      }}>
      {children}
    </ServicesContext.Provider>
  )
}

export const useServices = () => {
  const context = useContext(ServicesContext)
  if (context === undefined) {
    throw new Error('useServices must be used within a ServicesProvider')
  }
  return context
}