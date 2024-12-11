import { mutation } from "./_generated/server";
import { query } from "./_generated/server";
import { v } from "convex/values";

export const createChat = mutation({
  args: { sellerId: v.string(), customerId: v.string() },
  handler: async (ctx, args) => {
    const chat = await ctx.db.insert("chats", {
        sellerId: args.sellerId,
        customerId: args.customerId,
        updatedAt: Date.now(),
    });
    return chat;
  },
});

export const getChatById = query({
  args: { id: v.id("chats") },
  handler: async (ctx, args) => {
    const chat = await ctx.db.get(args.id);
    return chat;
  },
});

export const getSellerChats = query({
  args: { sellerId: v.string() },
  handler: async (ctx, args) => {
    const chats = await ctx.db
      .query("chats")
      .filter(q => q.eq(q.field("sellerId"), args.sellerId))
      .collect();

    const chatsWithLastMessage = await Promise.all(chats.map(async (chat) => {
      const lastMessage = await ctx.db
        .query("messages")
        .filter(q => q.eq(q.field("chatId"), chat._id))
        .order("asc")
        .first();
      return { ...chat, lastMessage };
    }));

    return chatsWithLastMessage;
  },
})

export const getCustomerChat = query({
  args: { sellerId: v.string(), customerId: v.string() },
  handler: async (ctx, args) => {
    const chat = await ctx.db
      .query("chats")
      .filter(q => q.eq(q.field("sellerId"), args.sellerId))
      .filter(q => q.eq(q.field("customerId"), args.customerId))
      .first();

    const messages = await ctx.db
      .query("messages")
      .filter(q => q.eq(q.field("chatId"), chat?._id))
      .order("asc")
      .collect()

    return { ...chat, messages };
  },
})
