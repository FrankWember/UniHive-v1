import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const updateUserLocation = mutation({
  args: { 
    userId: v.string(),
    isDriver: v.boolean(),
    latitude: v.number(),
    longitude: v.number()
  },
  handler: async (ctx, args) => {
    const { userId, isDriver, latitude, longitude } = args;
    
    const table = isDriver ? "drivers" : "passengers";
    const user = await ctx.db
      .query(table)
      .filter(q => q.eq(q.field("userId"), userId))
      .first();
    
    if (user) {
      await ctx.db.patch(user._id, { 
        currentLocation: { latitude, longitude },
        updatedAt: new Date().toString()
      });
    }
  },
});

export const RegisterPassenger = mutation({
    args: {
        userId: v.string(),
        availabilityStatus: v.union(
            v.literal("AVAILABLE"),
            v.literal("IN_RIDE"),
            v.literal("OFFLINE"),
            v.literal("SUSPENDED"),
            v.literal("BANNED")
        ),
        currentLocation: v.optional(v.object({
            latitude: v.number(),
            longitude: v.number()
        })),
    },
    handler: async (ctx, args) => {
        const { userId, availabilityStatus, currentLocation } = args;
        
        const passengerId = await ctx.db.insert("passengers", {
            userId,
            availabilityStatus,
            currentLocation,
            createdAt: new Date().toString(),
            updatedAt: new Date().toString(),
        });

        return passengerId;
    },
});

export const getPassengerByUserId = query({
  args: {
    userId: v.string()
  },
  handler: async (ctx, args) => {
    const { userId } = args
    const passenger = await ctx.db.query("passengers")
      .filter(q=>q.eq(q.field("userId"), userId))
      .first()
    return passenger
  }
})

export const agreeToRideRequest = mutation({
  args: { 
    rideRequestId: v.id("rideRequests"),
  },
  handler: async (ctx, args) => {
    const { rideRequestId } = args;
    
    const rideRequest = await ctx.db.patch(rideRequestId, { status: "AGREED" });
    
    return rideRequest;
  },
});


export const cancelRideRequest = mutation({
  args: {
    rideRequestId: v.id("rideRequests"),
  },
  handler: async (ctx, args) => {
    const { rideRequestId } = args;
    
    const rideRequest = await ctx.db.patch(rideRequestId, { status: "CANCELED" });

    return rideRequest;
  },
});

export const payRide = mutation({
  args: { 
    rideId: v.id("rideRequests"),
    payment: v.object({
      amount: v.number(),
      currency: v.string(),
      paymentMethod: v.union(v.literal("STRIPE"), v.literal("CASH"), v.literal("PAYPAL"), v.literal("VENMO")),
      paymentId: v.optional(v.string()),
    })
  },
  handler: async (ctx, args) => {
    const { rideId, payment } = args;
    
    const ride = await ctx.db.patch(rideId, { 
      payment: {
        amount: payment.amount, 
        currency: payment.currency, 
        paymentMethod: payment.paymentMethod, 
        paymentId: payment.paymentId, 
        status: "COMPLETED",
        createdAt: new Date().toISOString(), 
        updatedAt: new Date().toISOString()  
      }
    });

    return ride;
  },
});