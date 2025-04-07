// Enhanced chats.ts with debug logging
import { mutation } from "./_generated/server";
import { query } from "./_generated/server";
import { v } from "convex/values";

export const createChat = mutation({
  args: { sellerId: v.string(), customerId: v.string(), type: v.string() },
  handler: async (ctx, args) => {
    console.log("[Convex:createChat] Creating chat with args:", args);
    
    const chat = await ctx.db.insert("chats", {
        sellerId: args.sellerId,
        customerId: args.customerId,
        type: args.type,
        updatedAt: Date.now(),
    });
    
    console.log("[Convex:createChat] Chat created:", chat);
    return chat;
  },
});

export const getChatById = query({
  args: { id: v.id("chats") },
  handler: async (ctx, args) => {
    console.log("[Convex:getChatById] Fetching chat with ID:", args.id);
    
    const chat = await ctx.db.get(args.id);
    
    console.log("[Convex:getChatById] Found chat:", chat);
    return chat;
  },
});

export const getChatByUserIds = query({
  args: { sellerId: v.string(), customerId: v.string() },
  handler: async (ctx, args) => {
    console.log("[Convex:getChatByUserIds] Fetching chat with seller:", args.sellerId, "and customer:", args.customerId);
    
    const chat = await ctx.db
      .query("chats")
      .filter(q => q.eq(q.field("sellerId"), args.sellerId))
      .filter(q => q.eq(q.field("customerId"), args.customerId))
      .order("asc")
      .first();
    
    console.log("[Convex:getChatByUserIds] Found chat:", chat);
    return chat;
  },
});

export const getAllChats = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    console.log("[Convex:getAllChats] Fetching all chats for user:", args.userId);
    
    // Get all chats where the user is either seller or customer
    const allChats = await ctx.db
      .query("chats")
      .filter(q => 
        q.or(
          q.eq(q.field("sellerId"), args.userId),
          q.eq(q.field("customerId"), args.userId)
        )
      )
      .collect();
    
    console.log("[Convex:getAllChats] Found raw chats:", allChats);
    
    const chatsWithLastMessage = await Promise.all(allChats.map(async (chat) => {
      console.log(`[Convex:getAllChats] Processing chat: ${chat._id}`);
      
      const lastMessage = await ctx.db
        .query("messages")
        .filter(q => q.eq(q.field("chatId"), chat._id))
        .order("desc")
        .first();
      
      console.log(`[Convex:getAllChats] Last message for chat ${chat._id}:`, lastMessage);
      
      // Only count messages as unread if they were sent TO the current user (not BY them)
      const unreadCount = await ctx.db
        .query("messages")
        .filter(q => q.eq(q.field("chatId"), chat._id))
        .filter(q => q.not(q.eq(q.field("senderId"), args.userId))) // Not sent by current user
        .filter(q => q.eq(q.field("read"), false))
        .collect();
      
      console.log(`[Convex:getAllChats] Unread count for chat ${chat._id}:`, unreadCount.length);
      
      return { ...chat, lastMessage, unreadCount: unreadCount.length };
    }));

    console.log("[Convex:getAllChats] Final chats with metadata:", chatsWithLastMessage);
    return chatsWithLastMessage;
  },
});

// Enhanced messages.ts with debug logging
// Add this to a new file or update existing messages.ts
export const sendMessage = mutation({
    args: { chatId: v.id("chats"), senderId: v.string(), text: v.string() },
    handler: async (ctx, { chatId, senderId, text }) => {
        console.log("[Convex:sendMessage] Sending message:", { chatId, senderId, textLength: text.length });
        
        const messageId = await ctx.db.insert("messages", {
            chatId,
            senderId,
            text,
            timestamp: Date.now(),
            read: false
        });
        
        console.log("[Convex:sendMessage] Message sent with ID:", messageId);
        return messageId;
    },
});

export const getChatMessages = query({
    args: { chatId: v.id("chats") },
    handler: async (ctx, { chatId }) => {
        console.log("[Convex:getChatMessages] Fetching messages for chat:", chatId);