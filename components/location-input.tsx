"use client"

import { useState, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { MapPin } from 'lucide-react'
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface LocationInputProps {
  value: string
  onChange: (value: string) => void
}

export function LocationInput({ value, onChange }: LocationInputProps) {
  const [location, setLocation] = useState(value)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    setLocation(value)
  }, [value])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocation(e.target.value)
    onChange(e.target.value)
  }

  const handleGetCurrentLocation = () => {
    if ('geolocation' in navigator) {
      setIsLoading(true)
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords
          setLocation(`${latitude}, ${longitude}`)
          onChange(`${latitude}, ${longitude}`)
          setIsLoading(false)
        },
        (error) => {
          console.error('Error getting location:', error)
          setIsLoading(false)
        }
      )
    } else {
      console.error('Geolocation is not supported by this browser.')
    }
  }

  return (
    <div className="flex space-x-2">
      <Input
        type="text"
        value={location}
        onChange={handleChange}
        placeholder="Enter location or coordinates"
        className="flex-grow"
      />
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="w-[120px]" onClick={handleGetCurrentLocation} disabled={isLoading}>
            <MapPin className="w-4 h-4 mr-2" />
            {isLoading ? "Loading..." : "Current"}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80">
          <div className="grid gap-4">
            <div className="space-y-2">
              <h4 className="font-medium leading-none">Current Location</h4>
              <p className="text-sm text-muted-foreground">
                This will use your device's GPS to get your current location.
              </p>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}