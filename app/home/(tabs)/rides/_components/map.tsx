"use client"

import React, { useEffect, useRef, useState } from 'react'
import { Loader } from '@googlemaps/js-api-loader'
import { useTheme } from 'next-themes'

interface MapProps {
  center: google.maps.LatLngLiteral
  destination?: google.maps.LatLngLiteral
}

const lightModeStyle = [
  {
    featureType: "all",
    elementType: "geometry",
    stylers: [{ color: "#f5f5f5" }]
  },
  {
    featureType: "all",
    elementType: "labels.text.fill",
    stylers: [{ color: "#616161" }]
  },
  {
    featureType: "all",
    elementType: "labels.text.stroke",
    stylers: [{ color: "#f5f5f5" }]
  },
  {
    featureType: "poi",
    elementType: "geometry",
    stylers: [{ color: "#eeeeee" }]
  },
  {
    featureType: "poi",
    elementType: "labels.text.fill",
    stylers: [{ color: "#757575" }]
  },
  {
    featureType: "road",
    elementType: "geometry",
    stylers: [{ color: "#ffffff" }]
  },
  {
    featureType: "road.arterial",
    elementType: "labels.text.fill",
    stylers: [{ color: "#757575" }]
  },
  {
    featureType: "road.highway",
    elementType: "geometry",
    stylers: [{ color: "#dadada" }]
  },
  {
    featureType: "road.highway",
    elementType: "labels.text.fill",
    stylers: [{ color: "#616161" }]
  },
  {
    featureType: "water",
    elementType: "geometry",
    stylers: [{ color: "#c9c9c9" }]
  },
  {
    featureType: "water",
    elementType: "labels.text.fill",
    stylers: [{ color: "#9e9e9e" }]
  }
]

const darkModeStyle = [
  {
    featureType: "all",
    elementType: "geometry",
    stylers: [{ color: "#242f3e" }]
  },
  {
    featureType: "all",
    elementType: "labels.text.fill",
    stylers: [{ color: "#746855" }]
  },
  {
    featureType: "all",
    elementType: "labels.text.stroke",
    stylers: [{ color: "#242f3e" }]
  },
  {
    featureType: "poi",
    elementType: "geometry",
    stylers: [{ color: "#283d6a" }]
  },
  {
    featureType: "poi",
    elementType: "labels.text.fill",
    stylers: [{ color: "#d59563" }]
  },
  {
    featureType: "road",
    elementType: "geometry",
    stylers: [{ color: "#38414e" }]
  },
  {
    featureType: "road",
    elementType: "geometry.stroke",
    stylers: [{ color: "#212a37" }]
  },
  {
    featureType: "road",
    elementType: "labels.text.fill",
    stylers: [{ color: "#9ca5b3" }]
  },
  {
    featureType: "road.highway",
    elementType: "geometry",
    stylers: [{ color: "#746855" }]
  },
  {
    featureType: "road.highway",
    elementType: "geometry.stroke",
    stylers: [{ color: "#1f2835" }]
  },
  {
    featureType: "road.highway",
    elementType: "labels.text.fill",
    stylers: [{ color: "#f3d19c" }]
  },
  {
    featureType: "water",
    elementType: "geometry",
    stylers: [{ color: "#17263c" }]
  },
  {
    featureType: "water",
    elementType: "labels.text.fill",
    stylers: [{ color: "#515c6d" }]
  },
  {
    featureType: "water",
    elementType: "labels.text.stroke",
    stylers: [{ color: "#17263c" }]
  }
]

const Map: React.FC<MapProps> = ({ center, destination }) => {
  const mapRef = useRef<HTMLDivElement>(null)
  const [map, setMap] = useState<google.maps.Map | null>(null)
  const [directionsService, setDirectionsService] = useState<google.maps.DirectionsService | null>(null)
  const [directionsRenderer, setDirectionsRenderer] = useState<google.maps.DirectionsRenderer | null>(null)
  const { theme } = useTheme()

  useEffect(() => {
    const initMap = async () => {
      const loader = new Loader({
        apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
        version: "weekly",
        libraries: ["places"]
      })

      const google = await loader.load()
      const newMap = new google.maps.Map(mapRef.current!, {
        center,
        zoom: 14,
        styles: theme === 'dark' ? darkModeStyle : lightModeStyle,
        zoomControl: true,
        mapTypeControl: false,
        scaleControl: true,
        streetViewControl: false,
        rotateControl: true,
        fullscreenControl: false,
        gestureHandling: 'greedy'
      })

      setMap(newMap)
      setDirectionsService(new google.maps.DirectionsService())
      setDirectionsRenderer(new google.maps.DirectionsRenderer({
        map: newMap,
        suppressMarkers: true,
        polylineOptions: {
          strokeColor: theme === 'dark' ? '#4285F4' : '#4285F4',
          strokeWeight: 5,
        }
      }))
    }

    initMap()
  }, [center, theme])

  useEffect(() => {
    if (map && theme) {
      map.setOptions({ styles: theme === 'dark' ? darkModeStyle : lightModeStyle })
    }
  }, [map, theme])

  useEffect(() => {
    if (map && destination && directionsService && directionsRenderer) {
      directionsService.route(
        {
          origin: center,
          destination: destination,
          travelMode: google.maps.TravelMode.DRIVING,
        },
        (result, status) => {
          if (status === google.maps.DirectionsStatus.OK) {
            directionsRenderer.setDirections(result)

            // Add custom markers for origin and destination
            const originMarker = new google.maps.Marker({
              position: center,
              map: map,
              icon: {
                path: google.maps.SymbolPath.CIRCLE,
                scale: 7,
                fillColor: "#4285F4",
                fillOpacity: 1,
                strokeWeight: 2,
                strokeColor: "#FFFFFF",
              },
            })

            const destinationMarker = new google.maps.Marker({
              position: destination,
              map: map,
              icon: {
                path: google.maps.SymbolPath.CIRCLE,
                scale: 7,
                fillColor: "#EA4335",
                fillOpacity: 1,
                strokeWeight: 2,
                strokeColor: "#FFFFFF",
              },
            })
          }
        }
      )
    }
  }, [map, center, destination, directionsService, directionsRenderer])

  return <div ref={mapRef} className="map-container" />
}

export default Map