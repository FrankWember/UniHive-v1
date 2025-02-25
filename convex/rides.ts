import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { calculateDistance } from "../utils/helpers/distance";

export const findClosestDriver = query({
    args: { 
      passengerLat: v.number(), 
      passengerLon: v.number() 
    },
    handler: async (ctx, args) => {
      const { passengerLat, passengerLon } = args;
      
      const availableDrivers = await ctx.db
        .query("drivers")
        .filter(q => q.eq(q.field("availabilityStatus"), "AVAILABLE"))
        .collect();
      
      let closestDriver = null;
      let minDistance = Infinity;
      
      for (const driver of availableDrivers) {
        if (driver.currentLocation) {
          const distance = calculateDistance({
            lat1: passengerLat, 
            lon1: passengerLon,
            lat2: driver.currentLocation.latitude,  
            lon2: driver.currentLocation.longitude,
          })
          
          if (distance < minDistance) {
            minDistance = distance;
            closestDriver = driver;
          }
        }
      }
      
      return { driver: closestDriver, distance: minDistance };
    },
  });
  
export const createRideRequest = mutation({
args: { 
    passengerId: v.id("passengers"),
    pickupLat: v.number(),
    pickupLon: v.number(),
    pickupAddress: v.string(),
    dropoffLat: v.number(),
    dropoffLon: v.number(),
    dropoffAddress: v.string(),
    price: v.number(),
},
handler: async (ctx, args) => {
    const { passengerId, pickupLat, pickupLon, pickupAddress, dropoffLat, dropoffLon, dropoffAddress, price } = args;
    
    const rideRequestId = await ctx.db.insert("rideRequests", {
    passengerId,
    pickupLocation: { latitude: pickupLat, longitude: pickupLon, address: pickupAddress },
    dropoffLocation: { latitude: dropoffLat, longitude: dropoffLon, address: dropoffAddress },
    status: "PENDING",
    price,
    estimatedPrice: price,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
    });
    
    return rideRequestId;
},
});

export const getRide = query({
  args: {
    rideId: v.id("rideRequests")
  },
  handler: async (ctx, args) => {
    return await ctx.db.query("rideRequests")
      .filter(q=>q.eq(q.field("_id"), args.rideId))
      .first()
  }
})

export const getRideRequestsSortedByDistance = query({
  args: {
    lat: v.number(),
    lon: v.number(),
  },
  handler: async (ctx, args) => {
    const { lat, lon } = args;

    const rideRequests = await ctx.db.query("rideRequests")
      .filter((rideRequest) => rideRequest.neq(rideRequest.field("status"), "COMPLETED"))
      .filter((rideRequest) => rideRequest.neq(rideRequest.field("status"), "PAID"))
      .collect();

    return rideRequests.sort((a, b) => {
      const distanceA = calculateDistance({
        lat1: lat,
        lon1: lon,
        lat2: a.pickupLocation.latitude,
        lon2: a.pickupLocation.longitude,
      });

      const distanceB = calculateDistance({
        lat1: lat,
        lon1: lon,
        lat2: b.pickupLocation.latitude,
        lon2: b.pickupLocation.longitude,
      });

      return distanceA - distanceB;
    });
  },
});

export const updateRideStatus = mutation({
  args: { 
    rideId: v.id("rideRequests"),
    status: v.union(v.literal("PICKED_UP"), v.literal("STOPPED"), v.literal("COMPLETED"), v.literal("PAID"))
  },
  handler: async (ctx, args) => {
    const { rideId, status } = args;
    
    const ride = await ctx.db.patch(rideId, { status });

    return ride;
  },
});

export const updateRidePrice = mutation({
  args: { 
    rideId: v.id("rideRequests"),
    price: v.number()
  },
  handler: async (ctx, args) => {
    const { rideId, price } = args;
    
    const ride = await ctx.db.patch(rideId, { price });

    return ride;
  },
});