import * as z from "zod"

export const IDSignInSchema = z.object({
  student_id: z.string({required_error: "Please enter your student ID"})
    .min(8, "Minimum 8 characters required!")
    .max(10, "Maximum 10 characters required!")
    .startsWith("800", "Invalid student ID"),
  password: z.string({required_error: "You must use a password"})
    .min(8, "Minimum 8 characters required!"),
  code: z.optional(z.string()),
})

export const EmailSignInSchema = z.object({
  email: z.string({required_error: "You must have an email"})
    .email("Invalid email address"),
  password: z.string({required_error: "You must use a password"})
    .min(8, "Minimum 8 characters required!"),
  code: z.optional(z.string()),
})

export const SignUpSchema = z.object({
  name: z.string({required_error: "Please enter your name"})
    .min(5, "You names should be at least 5 characters long"),
  phone: z.string({required_error: "Please enter your phone number"})
    .min(8, "Please enter a valid phone number")
    .max(15, "Please enter a valid phone number"),
  student_id: z.string({required_error: "Please enter your student ID"})
    .min(8, "Minimum 8 characters required!")
    .max(10, "Maximum 10 characters required!")
    .startsWith("800", "Invalid student ID"),
  email: z.string({required_error: "You must have an email"})
    .email("Invald email address"),
  password: z.string({required_error: "Please Enter your password"})
    .min(8, "Minimum 8 characters required!"),
  confirm_password: z.string({required_error: "Please Enter your password"})
    .min(8, "Minimum 8 characters required!")
})

export const ResetSchema = z.object({
  email: z.string().email({
    message: "Invalid email address",
  }),
});

export const NewPasswordSchema = z.object({
  password: z.string({required_error: "Please Enter your password"})
    .min(8, "Minimum 8 characters required!"),
});

export const ServiceSchema = z.object({
  name: z.string().min(2, {
    message: "Service name must be at least 2 characters.",
  }),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }),
  price: z.number().min(0, {
    message: "Price must be a positive number.",
  }),
  category: z.array(z.string()).min(1, {
    message: "Please select at least one category.",
  }),
  images: z.array(z.string())
    .min(1, {
    message: "Please upload at least one image.",
    })
    .max(5, {
      message: "You can upload a maximum of 5 images.",
    }),
})

export const EventSchema = z.object({
  title: z.string().min(2, {
    message: "Title must be at least 2 characters.",
  }),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }),
  type: z.string().min(1, {
    message: "Please select an event type.",
  }),
  dateTime: z.string().refine((val) => !Number.isNaN(Date.parse(val)), {
    message: "Please enter a valid date and time.",
  }),
  location: z.string().min(2, {
    message: "Location must be at least 2 characters.",
  }),
  images: z.array(z.string())
    .min(1, {
    message: "Please upload at least one image.",
    })
    .max(5, {
      message: "You can upload a maximum of 5 images.",
    }),
})