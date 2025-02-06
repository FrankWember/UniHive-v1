"use client"

import React, { useState, useEffect, useRef } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useIsMobile } from '@/hooks/use-mobile';
import {
	Drawer,
	DrawerClose,
	DrawerContent,
	DrawerDescription,
	DrawerFooter,
	DrawerHeader,
	DrawerTitle,
	DrawerTrigger,
} from '@/components/ui/drawer';

import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
	DialogClose,
	DialogFooter,
} from '@/components/ui/dialog';
import { Search } from 'lucide-react'
import { Loader } from '@googlemaps/js-api-loader'

interface SearchDestinationProps {
  onDestinationSet: (lat: number, lng: number) => void
}

export const SearchDestination: React.FC<SearchDestinationProps> = ({ onDestinationSet }) => {
  const [isSearchOpen, setIsSearchOpen] = useState(true)
  const [query, setQuery] = useState("")
  const [predictions, setPredictions] = useState<google.maps.places.AutocompletePrediction[]>([])
  const autocompleteService = useRef<google.maps.places.AutocompleteService | null>(null)
  const placesService = useRef<google.maps.places.PlacesService | null>(null)

  useEffect(() => {
    if (typeof window !== 'undefined' && !autocompleteService.current) {
      const loader = new Loader({
        apiKey: process.env.NEXT_PRIVATE_GOOGLE_MAPS_API_KEY!,
        version: "weekly",
        libraries: ["places"]
      })

      loader.load().then(() => {
        autocompleteService.current = new google.maps.places.AutocompleteService()
        placesService.current = new google.maps.places.PlacesService(document.createElement('div'))
      })
    }
  }, [])

  useEffect(() => {
    if (query.length > 2 && autocompleteService.current) {
      autocompleteService.current.getPlacePredictions(
        { input: query },
        (predictions, status) => {
          if (status === google.maps.places.PlacesServiceStatus.OK && predictions) {
            setPredictions(predictions)
          }
        }
      )
    } else {
      setPredictions([])
    }
  }, [query])

  const handleSelect = (placeId: string) => {
    if (placesService.current) {
      placesService.current.getDetails(
        { placeId: placeId },
        (place, status) => {
          if (status === google.maps.places.PlacesServiceStatus.OK && place && place.geometry && place.geometry.location) {
            onDestinationSet(place.geometry.location.lat(), place.geometry.location.lng())
            setIsSearchOpen(false)
          }
        }
      )
    }
  }

  return (
    <DialogDrawerWrapper searchIsOpen={isSearchOpen} setSearchIsOpen={setIsSearchOpen}>
      <div className="p-4">
        <Input
          type="text"
          placeholder="Enter destination"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="mb-4"
        />
        <div className="space-y-2">
          {predictions.map((prediction) => (
            <Button
              key={prediction.place_id}
              variant="outline"
              className="w-full text-left justify-start h-auto py-2"
              onClick={() => handleSelect(prediction.place_id)}
            >
              {prediction.description}
            </Button>
          ))}
        </div>
      </div>
    </DialogDrawerWrapper>
  )
}


const DialogDrawerWrapper = ({ 
  children, 
  searchIsOpen, 
  setSearchIsOpen 
}: { 
  children: React.ReactNode, 
  searchIsOpen: boolean, 
  setSearchIsOpen: React.Dispatch<React.SetStateAction<boolean>> 
}) => {
	const isMobile = useIsMobile();

	const [open, setOpen] = React.useState(false);

	React.useEffect(() => {
		const down = (e: KeyboardEvent) => {
			if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
				e.preventDefault();
				setOpen((open) => !open);
			}
		};
		document.addEventListener('keydown', down);
		return () => document.removeEventListener('keydown', down);
	}, []);

	if (isMobile) {
		return (
			<Drawer open={searchIsOpen} onOpenChange={setSearchIsOpen}>
				<DrawerTrigger asChild>
          <Button 
            variant="secondary"
          >
            <Search className="mr-2 h-4 w-4" /> Where to?
          </Button>
				</DrawerTrigger>
				<DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Search Destination</DrawerTitle>
            <DrawerDescription>Enter your destination to find a ride.</DrawerDescription>
          </DrawerHeader>
					{children}
					<DrawerFooter>
						<DrawerClose asChild>
							<Button variant='outline' className='w-full'>
								Cancel
							</Button>
						</DrawerClose>
					</DrawerFooter>
				</DrawerContent>
			</Drawer>
		);
	} else {
		return (
			<Dialog open={open} onOpenChange={setOpen}>
				<DialogTrigger asChild>
          <Button 
            variant="secondary"
          >
            <Search className="mr-2 h-4 w-4" /> Where to?
          </Button>
				</DialogTrigger>
				<DialogContent>
          <DialogHeader>
            <DialogTitle>Search Destination</DialogTitle>
            <DialogDescription>Enter your destination to find a ride.</DialogDescription>
          </DialogHeader>
					{children}
					<DialogFooter className='flex justify-end gap-2'>
						<DialogClose asChild>
							<Button variant='secondary'>Cancel</Button>
						</DialogClose>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		);
	}
};