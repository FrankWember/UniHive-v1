import { mutation } from "./_generated/server";
import { query } from "./_generated/server";
import { v } from "convex/values";

export const sendMessage = mutation({
    args: { chatId: v.id("chats"), senderId: v.string(), text: v.string() },
    handler: async (ctx, { chatId, senderId, text }) => {
        await ctx.db.insert("messages", {
            chatId,
            senderId,
            text,
            timestamp: Date.now(),
            read: false
        });
    },
});

export const getChatMessages = query({
    args: { chatId: v.id("chats") },
    handler: async (ctx, { chatId }) => {
        return await ctx.db.query("messages").filter(q => q.eq(q.field("chatId"), chatId)).order("asc").collect();
    },
})

export const getServiceMessages = query({
    args: { customerId: v.string(), serviceId: v.string() },
    handler: async (ctx, { customerId, serviceId }) => {
        const customerChats = await ctx.db.query("messages").filter(q => q.eq(q.field("senderId"), customerId)).collect();
        const serviceChats = await ctx.db.query("messages").filter(q => q.eq(q.field("senderId"), serviceId)).collect();
        return [...customerChats, ...serviceChats];
    }
})

export const markAsRead = mutation({
    args: { messageId: v.id("messages") },
    handler: async (ctx, { messageId }) => {
        const message = await ctx.db.get(messageId);
        await ctx.db.patch(messageId, { read: true });
    },
})