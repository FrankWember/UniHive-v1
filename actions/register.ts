"use server";

import * as z from "zod";
import bcrypt from "bcryptjs";

import { SignUpSchema } from "@/constants/zod";
import { prisma } from "@/prisma/connection";
import { getUserByEmail, getUserByStudentId } from "@/utils/user";
import { generateVerificationToken } from "@/lib/tokens";
import { sendVerificationEmail } from "@/lib/mail";

export const register = async (values: z.infer<typeof SignUpSchema>) => {
  const validatedFields = SignUpSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }

  const { email, name, student_id, phone,  password } = validatedFields.data;
  const hashedPassword = await bcrypt.hash(password, 10);

  const existingUser = await getUserByEmail(email);
  if (existingUser) {
    return { error: "A confirmation email has been sent. Please check your junk or spam folder" };
  }

  const existingUserById = await getUserByStudentId(student_id);
  if (existingUserById) {
    return { error: "Student ID already in use!" };
  }

  await prisma.user.create({
    data: {
      name: name,
      email: email,
      phone: phone,
      studentId: student_id,
      password: hashedPassword,
    },
  });

  const verificationToken = await generateVerificationToken(email);
  await sendVerificationEmail(verificationToken.email, verificationToken.token);

  return { sucess: "Confirmation email sent! Check you Email or Spam" };
};
