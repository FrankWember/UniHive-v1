import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// 1. Send a new message
export const sendMessage = mutation({
  args: {
    chatId: v.id("chats"),
    senderId: v.string(),
    text: v.string(),
  },
  handler: async (ctx, { chatId, senderId, text }) => {
    return await ctx.db.insert("messages", {
      chatId,
      senderId,
      text,
      timestamp: Date.now(),
      read: false,
    });
  },
});

// 2. Get all messages in a specific chat
export const getChatMessages = query({
  args: { chatId: v.id("chats") },
  handler: async (ctx, { chatId }) => {
    return await ctx.db
      .query("messages")
      .filter((q) => q.eq(q.field("chatId"), chatId))
      .order("asc")
      .collect();
  },
});

// 3. Get messages between customer and service provider (based on shared chat)
export const getServiceMessages = query({
  args: {
    customerId: v.string(),
    serviceId: v.string(),
  },
  handler: async (ctx, { customerId, serviceId }) => {
    const chat = await ctx.db
      .query("chats")
      .filter((q) =>
        q.or(
          q.and(
            q.eq(q.field("customerId"), customerId),
            q.eq(q.field("sellerId"), serviceId)
          ),
          q.and(
            q.eq(q.field("customerId"), serviceId),
            q.eq(q.field("sellerId"), customerId)
          )
        )
      )
      .first();

    if (!chat) return [];

    return await ctx.db
      .query("messages")
      .filter((q) => q.eq(q.field("chatId"), chat._id))
      .order("asc")
      .collect();
  },
});

// 4. Mark a message as read
export const markAsRead = mutation({
  args: { messageId: v.id("messages") },
  handler: async (ctx, { messageId }) => {
    await ctx.db.patch(messageId, { read: true });
  },
});

// 5. Get all chats for a user with unread count and last message
export const getAllChats = query({
  args: { userId: v.string() },
  handler: async (ctx, { userId }) => {
    // Get only chats the user is involved in
    const chats = await ctx.db
      .query("chats")
      .filter((q) =>
        q.or(
          q.eq(q.field("customerId"), userId),
          q.eq(q.field("sellerId"), userId)
        )
      )
      .collect();

    const chatIds = chats.map((chat) => chat._id);

    // Fetch messages only from relevant chat IDs
    const messages = await ctx.db
      .query("messages")
      .filter((q) => q.or(...chatIds.map((id) => q.eq(q.field("chatId"), id))))
      .collect();

    return chats.map((chat) => {
      const chatMessages = messages.filter((m) => m.chatId === chat._id);
      const unreadCount = chatMessages.filter(
        (m) => !m.read && m.senderId !== userId
      ).length;

      const lastMessage =
        chatMessages.sort((a, b) => b.timestamp - a.timestamp)[0] ?? null;

      return {
        ...chat,
        unreadCount,
        lastMessage,
      };
    });
  },
});
