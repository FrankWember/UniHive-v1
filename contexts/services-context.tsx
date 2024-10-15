"use client"

import React, { createContext, useContext, useState, useEffect } from 'react'
import { getAllServices } from '@/actions/services'

type Service = {
  id: string
  name: string
  description: string
  providerId: string
  provider: {
    id: string
    name: string | null
  }
  category: string[]
}

type ServicesContextType = {
  services: Service[]
  isLoading: boolean
}

const ServicesContext = createContext<ServicesContextType | undefined>(undefined)

export const ServicesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [services, setServices] = useState<Service[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchServices = async () => {
      const fetchedServices = await getAllServices()
      setServices(fetchedServices)
      setIsLoading(false)
    }

    fetchServices()
  }, [])

  return (
    <ServicesContext.Provider value={{ services, isLoading }}>
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