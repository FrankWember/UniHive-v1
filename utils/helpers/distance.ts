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
    return calculateDistance({
      lat1: origin.lat,
      lon1: origin.lng,
      lat2: destination.lat,
      lon2: destination.lng
    });
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
  const toRadians = (degree: number) => degree * (Math.PI / 180);

	const R = 6371; // Earth's radius in kilometers

	const dLat = toRadians(lat2 - lat1);
	const dLon = toRadians(lon2 - lon1);

	const a =
		Math.sin(dLat / 2) * Math.sin(dLat / 2) +
		Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);

	const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

	return R * c * 1000; // Distance in meters
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