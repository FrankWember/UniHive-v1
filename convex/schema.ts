import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  chats: defineTable({
    sellerId: v.string(),
    customerId: v.string(),
    type: v.string(),
    updatedAt: v.number(),
  }),
  messages: defineTable({
    chatId: v.id("chats"),
    senderId: v.string(),
    text: v.string(),
    timestamp: v.number(),
    read: v.boolean(),
  }),
  drivers: defineTable({
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
    rating: v.array(v.number()),
    availabilityStatus: v.union(
      v.literal("AVAILABLE"),
      v.literal("BUSY"),
      v.literal("OFFLINE"),
      v.literal("SUSPENDED"),
      v.literal("BANNED")
    ),
    currentLocation: v.optional(v.object({
      latitude: v.number(),
      longitude: v.number()
    })),
    createdAt: v.string(),
    updatedAt: v.string(),
  }),
  passengers: defineTable({
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
    createdAt: v.string(),
    updatedAt: v.string(),
  }),
  rideRequests: defineTable({
    passengerId: v.id("passengers"),
    pickupLocation: v.object({
      latitude: v.number(),
      longitude: v.number()
    }),
    dropoffLocation: v.object({
      latitude: v.number(),
      longitude: v.number()
    }),
    status: v.union(v.literal("PENDING"), v.literal("AGREED"), v.literal("ACCEPTED"), v.literal("REJECTED"), v.literal("CANCELED")),
    createdAt: v.string(),
    updatedAt: v.string(),
    acceptedAt: v.optional(v.string()),
    rejectedAt: v.optional(v.string()),
    driverId: v.optional(v.id("drivers")),
    driverRating: v.optional(v.number()),
    driverStatus: v.optional(v.union(v.literal("AVAILABLE"), v.literal("BUSY"), v.literal("OFFLINE"))),
    driverCurrentLocation: v.optional(v.object({
      latitude: v.number(),
      longitude: v.number()
    })),
    price: v.number()
  }),
  ride: defineTable({
    passengerId: v.id("passengers"),
    pickupLocation: v.object({
      latitude: v.number(),
      longitude: v.number()
    }),
    dropoffLocation: v.object({
      latitude: v.number(),
      longitude: v.number()
    }),
    status: v.union(v.literal("PENDING"), v.literal("STOPPED"), v.literal("COMPLETED"), v.literal("PAID")),
    createdAt: v.string(),
    updatedAt: v.string(),
    acceptedAt: v.optional(v.string()),
    rejectedAt: v.optional(v.string()),
    driverId: v.optional(v.id("drivers")),
    driverRating: v.optional(v.number()),
    driverStatus: v.optional(v.union(v.literal("AVAILABLE"), v.literal("BUSY"), v.literal("OFFLINE"))),
    driverCurrentLocation: v.optional(v.object({
      latitude: v.number(),
      longitude: v.number()
    })),
    percentageCompleted: v.optional(v.number()),
    estimatedPrice: v.number(),
    payment: v.optional(v.object({
      amount: v.number(),
      currency: v.string(),
      status: v.union(v.literal("PENDING"), v.literal("COMPLETED"), v.literal("FAILED")),
      createdAt: v.string(),
      updatedAt: v.string(),
      paymentMethod: v.union(v.literal("STRIPE"), v.literal("CASH"), v.literal("PAYPAL"), v.literal("VENMO")),
      paymentId: v.optional(v.string()),
    }))
  })
})