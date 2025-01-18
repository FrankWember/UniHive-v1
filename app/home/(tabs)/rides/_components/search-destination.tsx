"use client"

import React, { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { Search } from 'lucide-react'

interface SearchResult {
  place_id: number
  lat: string
  lon: string
  display_name: string
}

interface SearchDestinationProps {
  onDestinationSet: (lat: number, lon: number) => void
}

export const SearchDestination: React.FC<SearchDestinationProps> = ({ onDestinationSet }) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<SearchResult[]>([])

  useEffect(() => {
    const searchDestination = async () => {
      if (query.length > 2) {
        try {
          const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`)
          const data = await response.json()
          setResults(data)
        } catch (error) {
          console.error("Error searching for location:", error)
        }
      } else {
        setResults([])
      }
    }

    const debounce = setTimeout(() => {
      searchDestination()
    }, 300)

    return () => clearTimeout(debounce)
  }, [query])

  const handleSelect = (result: SearchResult) => {
    onDestinationSet(parseFloat(result.lat), parseFloat(result.lon))
    setIsSearchOpen(false)
  }

  return (
    <Drawer open={isSearchOpen} onOpenChange={setIsSearchOpen}>
      <DrawerTrigger asChild>
        <Button 
          size="lg"
          className="w-full flex text-muted-foreground font-semibold justify-center space-x-4 bg-neutral-100 dark:bg-neutral-900 hover:border-stone-700 border" 
        >
          <Search className="mr-2 h-4 w-4" /> Where to?
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Search Destination</DrawerTitle>
          <DrawerDescription>Enter your destination to find a ride.</DrawerDescription>
        </DrawerHeader>
        <div className="p-4">
          <Input
            type="text"
            placeholder="Enter destination"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="mb-4"
          />
          <div className="space-y-2">
            {results.map((result) => (
              <Button
                key={result.place_id}
                variant="outline"
                className="w-full text-left justify-start h-auto py-2"
                onClick={() => handleSelect(result)}
              >
                {result.display_name}
              </Button>
            ))}
          </div>
        </div>
        <DrawerFooter>
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}