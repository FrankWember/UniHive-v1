import { mutation } from "./_generated/server";
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