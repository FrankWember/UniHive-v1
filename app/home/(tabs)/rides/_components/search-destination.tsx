// search-destination.tsx
"use client"

import React, { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardFooter, CardTitle, CardDescription, CardHeader } from "@/components/ui/card"
import { DialogDrawerWrapper } from "./dialog-drawer-wrapper"
import { useMutation, useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { useRouter } from "next/navigation"
import { useGoogleMaps } from "@/contexts/google-maps-context"
import { calculateRidePrice, getDistanceBetweenPoints } from "@/utils/helpers/distance"
import { BASE_FARE, RATE_PER_KM, SURGE_MULTIPLIER } from "@/constants/pricing"

interface SearchDestinationProps {
  destination: google.maps.LatLngLiteral | null
  onDestinationSet: (lat: number, lng: number) => void
  currentLocation: google.maps.LatLngLiteral | null
  setRideStatus: React.Dispatch<
    React.SetStateAction<"NOTHING" | "REQUESTED" | "AGREED" | "ACCEPTED" | "IN_PROGRESS" | "COMPLETED">
  >
  userId: string
}

export const SearchDestination: React.FC<SearchDestinationProps> = ({
  destination,
  onDestinationSet,
  currentLocation,
  setRideStatus,
  userId,
}) => {
  // Move these hooks to the top of the component, before any conditional returns
  const [query, setQuery] = useState("")
  const [predictions, setPredictions] = useState<google.maps.places.AutocompletePrediction[]>([])
  const [isSearchOpen, setIsSearchOpen] = useState(true)
  const [isLoading, setIsLoading] = useState(false)

  // Convex  functions
  const passenger = useQuery(api.passenger.getPassengerByUserId, userId ? { userId: userId } : "skip")
  const newPassenger = useMutation(api.passenger.RegisterPassenger)
  const requestRide = useMutation(api.rides.createRideRequest)

  const router = useRouter()
  const { google, isGoogleMapsLoaded, autocompleteService, placesService } = useGoogleMaps()

  if (!userId)
    return (
      <div className="flex flex-col items-center justify-center w-full h-screen">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-center text-2xl font-bold">No User Selected</CardTitle>
            <CardDescription className="max-w-sm px-2 text-center">Please sign in to find a ride.</CardDescription>
          </CardHeader>
          <CardFooter>
            <Button
              variant="secondary"
              onClick={() => router.push(`/auth/sign-in?callbackUrl=${encodeURIComponent("/home/rides")}`)}
            >
              Sign In
            </Button>
          </CardFooter>
        </Card>
      </div>
    )

  // Create a passenger in convex if there's not one for this user yet
  async function createNewPassenger() {
    if (userId && (passenger === null || passenger === undefined)) {
      return await newPassenger({
        userId: userId,
        availabilityStatus: "AVAILABLE",
        currentLocation: {
          latitude: currentLocation?.lat!,
          longitude: currentLocation?.lng!,
        },
      })
    }
  }

  // GET Place predictions from google maps api

  const getPlacePredictions = async () => {
    if (query.length > 2 && autocompleteService && google) {
      const result = await new Promise<google.maps.places.AutocompletePrediction[]>((resolve) => {
        autocompleteService.getPlacePredictions({ input: query }, (predictions, status) => {
          if (status === google.maps.places.PlacesServiceStatus.OK && predictions) {
            resolve(predictions)
          } else {
            resolve([])
          }
        })
      })
      setPredictions(result)
    } else {
      setPredictions([])
    }
  }

  useEffect(() => {
    getPlacePredictions()
  }, [query, autocompleteService, google])

  const handleSelect = async (placeId: string) => {
    setIsLoading(true)
    if (placesService && isGoogleMapsLoaded && google) {
      placesService.getDetails({ placeId: placeId }, (place, status) => {
        if (
          status === google.maps.places.PlacesServiceStatus.OK &&
          place &&
          place.geometry &&
          place.geometry.location
        ) {
          onDestinationSet(place.geometry.location.lat(), place.geometry.location.lng())
        }
      })

      const distance = await getDistanceBetweenPoints({
        origin: { lat: currentLocation?.lat!, lng: currentLocation?.lng! },
        destination: { lat: destination?.lat!, lng: destination?.lng! },
        google,
      })

      if (!passenger) {
        createNewPassenger()
      }

      const newRide = await requestRide({
        passengerId: passenger?._id!,
        pickupLat: currentLocation?.lat!,
        pickupLon: currentLocation?.lng!,
        dropoffLat: destination?.lat!,
        dropoffLon: destination?.lng!,
        price: calculateRidePrice({
          distanceKm: distance!,
          baseFare: BASE_FARE,
          ratePerKm: RATE_PER_KM,
          surgeMultiplier: SURGE_MULTIPLIER,
        }),
      })
      setRideStatus("REQUESTED")
      setIsSearchOpen(false)
    }
    setIsLoading(false)
  }

  return (
    <DialogDrawerWrapper 
      title="Search Destination"
      description="Enter your destination to find a ride."
      searchIsOpen={isSearchOpen} 
      setSearchIsOpen={setIsSearchOpen}>
      <div className="p-4 flex flex-col gap-2">
        <Input
          type="text"
          placeholder="Enter destination"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="mb-4"
        />
        <div className="flex flex-col space-y-2">
          {predictions.map((prediction) => (
            <Button
              key={prediction.place_id}
              variant="outline"
              className="relative w-full text-left justify-start h-auto py-2 truncate"
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



