"use client";

import { createContext, useState, useEffect, useContext, useRef } from "react";
import { Loader } from "@googlemaps/js-api-loader";

type GoogleType = typeof google | null;

interface GoogleMapsContextProps {
  google: typeof google | null;
  isGoogleMapsLoaded: boolean;
  autocompleteService: google.maps.places.AutocompleteService | null;
  placesService: google.maps.places.PlacesService | null;
}

const GoogleMapsContext = createContext<GoogleMapsContextProps>({
  google: null,
  isGoogleMapsLoaded: false,
  autocompleteService: null,
  placesService: null,
});

interface GoogleMapsProviderProps {
  children: React.ReactNode;
}

export const GoogleMapsProvider: React.FC<GoogleMapsProviderProps> = ({
  children,
}) => {
  const [google, setGoogle] = useState<GoogleType>(null);
  const [isGoogleMapsLoaded, setIsGoogleMapsLoaded] = useState(false);
  const [autocompleteService, setAutocompleteService] =
    useState<google.maps.places.AutocompleteService | null>(null);
  const [placesService, setPlacesService] =
    useState<google.maps.places.PlacesService | null>(null);

  useEffect(() => {
    const loadGoogleMaps = async () => {
      const loader = new Loader({
        apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
        version: "weekly",
        libraries: ["places"],
      });

      try {
        const google = await loader.load();
        setGoogle(google);
        setIsGoogleMapsLoaded(true);

        // Initialize Autocomplete and Places Services
        const newAutocompleteService =
          new google.maps.places.AutocompleteService();
        setAutocompleteService(newAutocompleteService);

        // Create a dummy element for PlacesService
        const dummyElement = document.createElement("div");
        const newPlacesService = new google.maps.places.PlacesService(
          dummyElement
        );
        setPlacesService(newPlacesService);
      } catch (error) {
        console.error("Error loading Google Maps API:", error);
        // Handle the error appropriately (e.g., display an error message)
      }
    };

    loadGoogleMaps();
  }, []);

  return (
    <GoogleMapsContext.Provider
      value={{
        google,
        isGoogleMapsLoaded,
        autocompleteService,
        placesService,
      }}
    >
      {children}
    </GoogleMapsContext.Provider>
  );
};

export const useGoogleMaps = () => {
  return useContext(GoogleMapsContext);
};
