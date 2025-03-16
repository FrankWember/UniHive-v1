import { mutation } from "./_generated/server";
import { query } from "./_generated/server";
import { v } from "convex/values";

export const createChat = mutation({
  args: { sellerId: v.string(), customerId: v.string(), type: v.string() },
  handler: async (ctx, args) => {
    const chat = await ctx.db.insert("chats", {
        sellerId: args.sellerId,
        customerId: args.customerId,
        type: args.type,
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

export const getChatByUserIds = query({
  args: { sellerId: v.string(), customerId: v.string() },
  handler: async (ctx, args) => {
    const chat = await ctx.db
      .query("chats")
      .filter(q => q.eq(q.field("sellerId"), args.sellerId))
      .filter(q => q.eq(q.field("customerId"), args.customerId))
      .order("asc")
      .first();
    return chat;
  },
});

export const getAllChats = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const sellerChats = await ctx.db
      .query("chats")
      .filter(q => q.eq(q.field("sellerId"), args.userId))
      .filter(q => q.not(q.eq(q.field("customerId"), args.userId)))
      .order("asc")
      .collect();

    const customerChats = await ctx.db
      .query("chats")
      .filter(q => q.eq(q.field("customerId"), args.userId))
      .order("asc")
      .collect();
    
    const allChats = [...sellerChats, ...customerChats]

    const chatsWithLastMessage = await Promise.all(allChats.map(async (chat) => {
      const lastMessage = await ctx.db
        .query("messages")
        .filter(q => q.eq(q.field("chatId"), chat._id))
        .order("desc")
        .first();
      const unreadCount = await ctx.db
        .query("messages")
        .filter(q => q.eq(q.field("chatId"), chat._id))
        .filter(q => q.not(q.eq(q.field("read"), true)))
        .collect()
      return { ...chat, lastMessage, unreadCount: unreadCount.length };
    }));

    return chatsWithLastMessage;
  },
});

