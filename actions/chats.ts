"use server"

import { prisma } from "@/prisma/connection"
import { auth } from "@/auth"

export async function getGroupChats(studyGroupId: string) {
  return prisma.chat.findMany({
    where: { studyGroupId },
    include: {
      participants: {
        include: {
          user: {
            select: { id: true, name: true },
          },
        },
      },
    },
  })
}

export async function createGroupChat(data: { name: string; studyGroupId: string }) {
  const session = await auth()
  if (!session?.user?.id) {
    throw new Error("You must be logged in to create a group chat")
  }

  return prisma.chat.create({
    data: {
      ...data,
      participants: {
        create: {
          userId: session.user.id,
        },
      },
    },
  })
}

export async function joinGroupChat(chatId: string) {
  const session = await auth()
  if (!session?.user?.id) {
    throw new Error("You must be logged in to join a group chat")
  }

  return prisma.chatParticipant.create({
    data: {
      chatId,
      userId: session.user.id,
    },
  })
}

export async function leaveGroupChat(chatId: string) {
  const session = await auth()
  if (!session?.user?.id) {
    throw new Error("You must be logged in to leave a group chat")
  }

  return prisma.chatParticipant.delete({
    where: {
        userId_chatId:{
            chatId,
            userId: session.user.id,
      },
    },
  })
}

export async function sendMessage(data: { chatId: string; content: string }) {
  const session = await auth()
  if (!session?.user?.id) {
    throw new Error("You must be logged in to send a message")
  }

  return prisma.message.create({
    data: {
      ...data,
      senderId: session.user.id,
    },
  })
}

export async function getMessages(chatId: string) {
  return prisma.message.findMany({
    where: { chatId },
    include: {
      sender: {
        select: { id: true, name: true },
      },
    },
    orderBy: { sendTime: 'asc' },
  })
}