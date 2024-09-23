import * as z from "zod"

export const IDSignInSchema = z.object({
  student_id: z.string({required_error: "Please enter your student ID"})
    .min(8, "You names should be at least 8 characters long")
    .max(10, "Your student ID cannot exceed 10 characters long")
    .startsWith("800", "Invalid student ID"),
  password: z.string({required_error: "You must use a password"}).min(8),
})

export const EmailSignInSchema = z.object({
  email: z.string({required_error: "You must have an email"}).email(),
  password: z.string({required_error: "You must use a password"}).min(8),
})

export const SignUpSchema = z.object({
  name: z.string({required_error: "Please enter your name"})
    .min(5, "You names should be at least 5 characters long"),
  phone: z.string({required_error: "Please enter your phone number"})
    .min(8, "Please enter a valid phone number")
    .max(15, "Please enter a valid phone number"),
  student_id: z.string({required_error: "Please enter your student ID"})
    .min(8, "You names should be at least 8 characters long")
    .max(10, "Your student ID cannot exceed 10 characters long")
    .startsWith("800", "Invalid student ID"),
  email: z.string({required_error: "You must have an email"})
    .email("Invald email address"),
  password: z.string({required_error: "Please Enter your password"})
    .min(8, "Your password must be at least 8 characters long"),
  confirm_password: z.string({required_error: "Please Enter your password"})
    .min(8, "Your password must be at least 8 characters long")
})