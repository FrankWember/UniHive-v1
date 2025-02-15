interface LatLng {
  lat: number;
  lng: number;
}

interface DistanceMatrixResponse {
  rows: {
    elements: {
      distance: {
        text: string;
        value: number; // Distance in meters
      };
      duration: {
        text: string;
        value: number; // Duration in seconds
      };
      status: google.maps.DistanceMatrixElementStatus;
    }[];
  }[];
  status: google.maps.DistanceMatrixStatus;
}

type GoogleType = typeof google | null;

export const getDistanceBetweenPoints = async (
  {
    origin,
    destination,
    google
  }: {
    origin: LatLng,
    destination: LatLng,
    google: GoogleType
  }
): Promise<number | null> => {
  if (!google) {
    return null; // Return null if Google Maps API is not loaded
  }

  try {
    const service = new google.maps.DistanceMatrixService();

    const request = {
      origins: [new google.maps.LatLng(origin.lat, origin.lng)],
      destinations: [new google.maps.LatLng(destination.lat, destination.lng)],
      travelMode: google.maps.TravelMode.DRIVING, // or BICYCLING, TRANSIT, WALKING
      unitSystem: google.maps.UnitSystem.METRIC,
    };

    return new Promise((resolve, reject) => {
      service.getDistanceMatrix(
        request,
        (response: google.maps.DistanceMatrixResponse | null, status: google.maps.DistanceMatrixStatus) => {
          if (status === google.maps.DistanceMatrixStatus.OK && response) {
            const distanceInMeters = response.rows[0].elements[0].distance.value;
            const distanceInKm = distanceInMeters / 1000;
            resolve(distanceInKm);
          } else {
            console.error("Distance Matrix API error:", status);
            reject(new Error(`Distance Matrix API error: ${status}`));
            resolve(null); // Resolve with null on error
          }
        }
      );
    });
  } catch (error) {
    console.error("Google Maps API loading error:", error);
    return null; // Return null on error
  }
};

export const calculateDistance = ({
    lat1,
    lon1,
    lat2,
    lon2,
  }: {
    lat1: number;
    lon1: number;
    lat2: number;
    lon2: number;
}) => {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1); // deg2rad below
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) *
      Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c; // Distance in km
  return d;
};

const deg2rad = (deg: number) => {
  return deg * (Math.PI / 180);
};

interface PriceCalculationParams {
  distanceKm: number;
  baseFare: number;
  ratePerKm: number;
  surgeMultiplier?: number; // Optional surge pricing
}

export const calculateRidePrice = (params: PriceCalculationParams): number => {
  const { distanceKm, baseFare, ratePerKm, surgeMultiplier = 1 } = params;

  const distanceCost = distanceKm * ratePerKm;
  const subtotal = baseFare + distanceCost;
  const totalPrice = subtotal * surgeMultiplier;

  return parseFloat(totalPrice.toFixed(2)); // Round to 2 decimal places
};