"use client"

import type React from "react"
import { useEffect, useRef, useState } from "react"
import { useTheme } from "next-themes"
import { useGoogleMaps } from "@/contexts/google-maps-context"
import { lightModeStyle, darkModeStyle } from "@/constants/map-styles"

interface MapProps {
  center: google.maps.LatLngLiteral
  destination?: google.maps.LatLngLiteral
}

const Map: React.FC<MapProps> = ({ center, destination }) => {
  const mapRef = useRef<HTMLDivElement>(null)
  const { google, isGoogleMapsLoaded } = useGoogleMaps()
  const [map, setMap] = useState<google.maps.Map | null>(null)
  const [directionsService, setDirectionsService] = useState<google.maps.DirectionsService | null>(null)
  const [directionsRenderer, setDirectionsRenderer] = useState<google.maps.DirectionsRenderer | null>(null)
  const { theme, systemTheme } = useTheme()

  useEffect(() => {
    const initMap = async () => {
      if (!isGoogleMapsLoaded || !google) {
        return // Don't proceed until Google Maps is loaded
      }

      const currentTheme = theme === "system" ? systemTheme : theme

      const newMap = new google.maps.Map(mapRef.current!, {
        center,
        zoom: 14,
        styles: currentTheme === "dark" ? darkModeStyle : lightModeStyle,
        zoomControl: true,
        mapTypeControl: false,
        scaleControl: true,
        streetViewControl: false,
        rotateControl: true,
        fullscreenControl: false,
        gestureHandling: "greedy",
      })

      setMap(newMap)
      setDirectionsService(new google.maps.DirectionsService())
      setDirectionsRenderer(
        new google.maps.DirectionsRenderer({
          map: newMap,
          suppressMarkers: true,
          polylineOptions: {
            strokeColor: currentTheme === "dark" ? "#4285F4" : "#4285F4",
            strokeWeight: 5,
          },
        }),
      )
    }

    initMap()
  }, [center, theme, systemTheme])

  useEffect(() => {
    if (map) {
      const currentTheme = theme === "system" ? systemTheme : theme
      map.setOptions({ styles: currentTheme === "dark" ? darkModeStyle : lightModeStyle })
    }
  }, [map, theme, systemTheme])

  useEffect(() => {
    if (map && destination && directionsService && directionsRenderer) {
      directionsService.route(
        {
          origin: center,
          destination: destination,
          travelMode: google!.maps.TravelMode.DRIVING,
        },
        (result, status) => {
          if (status === google!.maps.DirectionsStatus.OK) {
            directionsRenderer.setDirections(result)

            // Add custom markers for origin and destination
            const originMarker = new google!.maps.Marker({
              position: center,
              map: map,
              icon: {
                path: google!.maps.SymbolPath.CIRCLE,
                scale: 7,
                fillColor: "#4285F4",
                fillOpacity: 1,
                strokeWeight: 2,
                strokeColor: "#FFFFFF",
              },
            })

            const destinationMarker = new google!.maps.Marker({
              position: destination,
              map: map,
              icon: {
                path: google!.maps.SymbolPath.CIRCLE,
                scale: 7,
                fillColor: "#EA4335",
                fillOpacity: 1,
                strokeWeight: 2,
                strokeColor: "#FFFFFF",
              },
            })
          }
        },
      )
    }
  }, [map, center, destination, directionsService, directionsRenderer])

  return <div ref={mapRef} className="map-container" />
}

export default Map

