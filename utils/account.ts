import { prisma } from "@/prisma/connection";

export const getAccountByUserId = async (userId: string) => {
  try {
    const account = await prisma.account.findFirst({
      where: { userId },
    });

    return account;
  } catch (error) {
    return null;
  }
};
