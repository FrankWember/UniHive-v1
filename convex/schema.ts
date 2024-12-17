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
})