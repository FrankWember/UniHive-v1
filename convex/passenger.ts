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
