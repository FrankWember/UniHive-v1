"use client"

import React, { useEffect, useRef } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css'
import 'leaflet-routing-machine'

// Extend the L (Leaflet) object to include the Routing property
declare module 'leaflet' {
  export namespace Routing {
    function control(options: ControlOptions): Control
    interface Control extends L.Control {}
    interface ControlOptions {
      waypoints: L.LatLng[]
      routeWhileDragging?: boolean
    }
  }
}

delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: '/images/marker-icon-2x.png',
  iconUrl: '/images/marker-icon.png',
  shadowUrl: '/images/marker-shadow.png',
})

interface MapProps {
  center: [number, number]
  destination?: [number, number]
}

const Map: React.FC<MapProps> = ({ center, destination }) => {
  const mapRef = useRef<L.Map | null>(null)
  const routingControlRef = useRef<L.Routing.Control | null>(null)

  useEffect(() => {
    if (!mapRef.current) {
      mapRef.current = L.map('map').setView(center, 13)

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(mapRef.current)

      const marker = L.marker(center).addTo(mapRef.current)
      marker.bindPopup('Your location').openPopup()
    } else {
      mapRef.current.setView(center)
    }

    if (destination) {
      const destMarker = L.marker(destination).addTo(mapRef.current)
      destMarker.bindPopup('Destination').openPopup()

      if (routingControlRef.current) {
        mapRef.current.removeControl(routingControlRef.current)
      }

      routingControlRef.current = L.Routing.control({
        waypoints: [
          L.latLng(center[0], center[1]),
          L.latLng(destination[0], destination[1])
        ],
        routeWhileDragging: true
      }).addTo(mapRef.current)
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove()
        mapRef.current = null
      }
      if (routingControlRef.current) {
        routingControlRef.current = null
      }
    }
  }, [center, destination])

  return <div id="map" style={{ height: '100%', width: '100%' }} />
}

export default Map