import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const RegisterDriver = mutation({
    args: {
        userId: v.string(),
        age: v.number(),
        license: v.string(),
        yearsOfExperience: v.number(),
        carImages: v.array(v.string()),
        carBrand: v.string(),
        carModel: v.string(),
        mileage: v.number(),
        plateNumber: v.string(),
        carStatus: v.union(
            v.literal("NEW"),
            v.literal("SECOND_HAND"),
            v.literal("OLD")
        ),
        availabilityStatus: v.union(
            v.literal("AVAILABLE"),
            v.literal("BUSY"),
            v.literal("OFFLINE")
        ),
        currentLocation: v.optional(v.object({
            latitude: v.number(),
            longitude: v.number()
        })),
    },
    handler: async (ctx, args) => {
        const { userId, age, license, yearsOfExperience, carImages, carBrand, carModel, mileage, plateNumber, carStatus, availabilityStatus, currentLocation } = args;
        
        const driverId = await ctx.db.insert("drivers", {
            userId,
            age,
            license,
            yearsOfExperience,
            carImages,
            carBrand,
            carModel,
            mileage,
            plateNumber,
            carStatus,
            availabilityStatus,
            rating: [],
            currentLocation,
            createdAt: new Date().toString(),
            updatedAt: new Date().toString(),
        });

        return driverId;
    },
});

export const updateDriverStatus = mutation({
  args: { 
    driverId: v.id("drivers"),
    status: v.union(v.literal("AVAILABLE"), v.literal("BUSY"), v.literal("OFFLINE"))
  },
  handler: async (ctx, args) => {
    const { driverId, status } = args;
    
    await ctx.db.patch(driverId, { availabilityStatus: status });
  },
});


export const acceptRideRequest = mutation({
  args: { 
    rideRequestId: v.id("rideRequests"),
    driverId: v.id("drivers"),
  },
  handler: async (ctx, args) => {
    const { rideRequestId, driverId } = args;

    const driver = await ctx.db.query("drivers").filter(q => q.eq(q.field("_id"), driverId)).first();
    if (!driver) {
      return false
    }
    
    const rideRequest = await ctx.db.patch(
      rideRequestId, 
      { 
        status: "ACCEPTED", 
        driverId: driver._id,
        driverRating: driver.rating.length > 0 ? driver.rating.reduce((a, b) => a + b) / driver.rating.length : 0,
        driverStatus: "AVAILABLE",
        driverCurrentLocation: driver.currentLocation,
        acceptedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    );
    
    await ctx.db.patch(driverId, { availabilityStatus: "BUSY" });
    
    return true;
  },
});

export const rejectRideRequest = mutation({
  args: {
    rideRequestId: v.id("rideRequests"),
  },
  handler: async (ctx, args) => {
    const { rideRequestId } = args;
    
    const rideRequest = await ctx.db.patch(rideRequestId, { status: "REJECTED" });

    return rideRequest;
  },
});

export const getDriver = query({
  args: {
    driverId: v.id("drivers")
  },
  handler: async (ctx, args) => {
    return await ctx.db.query("drivers")
      .filter(q=>q.eq(q.field("_id"), args.driverId))
      .first()
  }
});

export const getDriverByUserId = query({
  args: {
    userId: v.string()
  },
  handler: async (ctx, args) => {
    const { userId } = args
    const driver = await ctx.db.query("drivers")
      .filter(q=>q.eq(q.field("userId"), userId))
      .first()
    return driver
  }
})


