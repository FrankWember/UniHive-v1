"use client"

import { createContext, useContext, useCallback, useState, ReactNode } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../convex/_generated/api';
import { Id } from '../convex/_generated/dataModel';

// Types
type Location = {
  latitude: number;
  longitude: number;
};

type RideStatus = 
  | "PENDING"
  | "AGREED"
  | "ACCEPTED"
  | "REJECTED"
  | "CANCELED"
  | "PICKED_UP"
  | "STOPPED"
  | "COMPLETED"
  | "PAID";

type Payment = {
  amount: number;
  currency: string;
  status: "PENDING" | "COMPLETED" | "FAILED";
  createdAt: string;
  updatedAt: string;
  paymentMethod: "STRIPE" | "CASH" | "PAYPAL" | "VENMO";
  paymentId?: string;
};

type Driver = {
    _id: Id<"drivers">;
    userId: string;
    age: number;
    license: string;
    yearsOfExperience: number;
    carImages: string[];
    carBrand: string;
    carModel: string;
    mileage: number;
    plateNumber: string;
    carStatus: "NEW" | "SECOND_HAND" | "OLD";
    rating: number[];
    availabilityStatus: "AVAILABLE" | "BUSY" | "OFFLINE" | "SUSPENDED" | "BANNED";
    currentLocation?: Location;
    createdAt: string;
    updatedAt: string;
}

type RideRequest = {
  _id: Id<"rideRequests">;
  passengerId: Id<"passengers">;
  pickupLocation: Location;
  dropoffLocation: Location;
  status: RideStatus;
  createdAt: string;
  updatedAt: string;
  acceptedAt?: string;
  rejectedAt?: string;
  driverId?: Id<"drivers">;
  driverRating?: number;
  driverStatus?: "AVAILABLE" | "BUSY" | "OFFLINE";
  driverCurrentLocation?: Location;
  price?: number;
  estimatedPrice?: number;
  percentageCompleted?: number;
  payment?: Payment;
};

type RideContextType = {
    activeRideId: Id<"rideRequests"> | null;
    setActiveRideId: (rideId: Id<"rideRequests"> | null) => void;
    activeRide: RideRequest | null;
    driver: Driver | null;
    isLoading: boolean;
    error: Error | null;
    findNearestDriver: (passengerLat: number, passengerLon: number) => Promise<void>;
    createRide: (
        passengerId: Id<"passengers">,
        pickupLat: number,
        pickupLon: number,
        dropoffLat: number,
        dropoffLon: number,
        price: number
    ) => Promise<Id<"rideRequests">>;
    updateRideStatus: (rideId: Id<"rideRequests">, status: "PICKED_UP" | "STOPPED" | "COMPLETED") => Promise<void>;
    updatePrice: (rideId: Id<"rideRequests">, price: number) => Promise<void>;
    nearestDriver: {
        driver: any;
        distance: number;
    } | null;
};

// Create context
const RideContext = createContext<RideContextType | undefined>(undefined);

// Provider component
export function RideProvider({ children }: { children: ReactNode }) {
    const [activeRideId, setActiveRideId] = useState<Id<"rideRequests"> | null>(null);
    const [nearestDriver, setNearestDriver] = useState<{ driver: Driver|null; distance: number } | null>(null);
    const [error, setError] = useState<Error | null>(null);
    const [isLoading, setIsLoading] = useState(false);

  // Convex mutations and queries
  const activeRide = useQuery(
    api.rides.getRide, 
    activeRideId ? { rideId: activeRideId } : "skip"
  ) || null;
  const driver = useQuery(api.driver.getDriver, activeRide?.driverId ? { driverId: activeRide?.driverId } : "skip") || null;
  const createRideRequest = useMutation(api.rides.createRideRequest);
  const updateRideStatusMutation = useMutation(api.rides.updateRideStatus);
  const updateRidePriceMutation = useMutation(api.rides.updateRidePrice);

  const findNearestDriver = useCallback(async (passengerLat: number, passengerLon: number) => {
    setIsLoading(true);
    try {
      const result = useQuery(api.rides.findClosestDriver, { passengerLat, passengerLon });
      if (result) {
        setNearestDriver(result);
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to find nearest driver'));
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createRide = useCallback(async (
    passengerId: Id<"passengers">,
    pickupLat: number,
    pickupLon: number,
    dropoffLat: number,
    dropoffLon: number,
    price: number
  ) => {
    setIsLoading(true);
    try {
      const rideId = await createRideRequest({
        passengerId,
        pickupLat,
        pickupLon,
        dropoffLat,
        dropoffLon,
        price
      });
      return rideId;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to create ride'));
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [createRideRequest]);

  const updateRideStatus = useCallback(async (
    rideId: Id<"rideRequests">, 
    status: "PICKED_UP" | "STOPPED" | "COMPLETED"
  ) => {
    setIsLoading(true);
    try {
      await updateRideStatusMutation({
        rideId,
        status
      });
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to update ride status'));
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [updateRideStatusMutation]);

  const updatePrice = useCallback(async (rideId: Id<"rideRequests">, price: number) => {
    setIsLoading(true);
    try {
      await updateRidePriceMutation({
        rideId,
        price
      });
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to update ride price'));
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [updateRidePriceMutation]);

  const value = {
    activeRideId,
    setActiveRideId, 
    activeRide,
    driver,
    isLoading,
    error,
    findNearestDriver,
    createRide,
    updateRideStatus,
    updatePrice,
    nearestDriver
  };

  return (
    <RideContext.Provider value={value}>
      {children}
    </RideContext.Provider>
  );
}

// Custom hook to use the ride context
export function useRide() {
  const context = useContext(RideContext);
  if (context === undefined) {
    throw new Error('useRide must be used within a RideProvider');
  }
  return context;
}

// Custom hook to fetch a specific ride
export function useRideDetails(rideId: Id<"rideRequests"> | null) {
  const ride = useQuery(api.rides.getRide, rideId ? { rideId } : "skip");
  
  return {
    ride: ride ?? null,
    isLoading: ride === undefined && rideId !== null,
  };
}

export default RideContext;