import { prisma } from "@/prisma/connection"

export const getUserByEmail = async (email: string) => {
    const user = await prisma.user.findUnique({
        where: {
            email: email
        }
    })
    if (!user) return null
    return user
}

export const getUserById = async (userId: string) => {
    const user = await prisma.user.findUnique({
        where: {
            id: userId
        }
    })
    if (!user) return null
    return user
}