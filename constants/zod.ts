import { ProductState } from "@prisma/client";
import { title } from "process";
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

export const ChatSchema = z.object({
  name: z.string().min(1, "Chat name is required"),
  participants: z.array(z.string()).min(1, "At least one participant is required")
})

export const NewPasswordSchema = z.object({
  password: z.string({required_error: "Please Enter your password"})
    .min(8, "Minimum 8 characters required!"),
});

const TimeSlotSchema = z.array(z.tuple([z.string(), z.string()]));

const AvailabilitySchema = z.object({
  monday: TimeSlotSchema.optional(),
  tuesday: TimeSlotSchema.optional(),
  wednesday: TimeSlotSchema.optional(),
  thursday: TimeSlotSchema.optional(),
  friday: TimeSlotSchema.optional(),
  saturday: TimeSlotSchema.optional(),
  sunday: TimeSlotSchema.optional(),
});

export const ServiceSchema = z.object({
  name: z.string().min(2, {
    message: "Service name must be at least 2 characters.",
  }),
  price: z.number().min(0, {
    message: "Price must be a positive number.",
  }),
  discount: z.number().min(0).max(100).optional(),
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
  defaultLocation: z.string()
  .min(1, "Default location is required"),
  isMobile: z.boolean().default(false),
  availability: AvailabilitySchema
})

export const ServiceOfferSchema = z.object({
  title: z.string().min(2, {
    message: "Title must be at least 2 characters.",
  }),
  price: z.number().min(0, {
    message: "Price must be a positive number.",
  }),
  discount: z.number().min(0).max(100).default(0).optional(),
  duration: z.number()
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
  dateTime: z.date(),
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

const states = [ProductState.NEW, ProductState.USED, ProductState.DAMAGED, ProductState.REFURBISHED]

export const productSchema = z.object({
  name: z.string().min(1, 'Product name is required'),
  description: z.string().min(10, 'Description must be at least 10 characters long'),
  price: z.number().positive('Price must be positive'),
  discount: z.number().min(0).max(100).optional(),
  stock: z.number().int().positive('Stock must be a positive integer'),
  images: z.array(z.string().url()).min(1, 'At least one image is required'),
  categories: z.array(z.string()).min(1, 'At least one category is required'),
  state: z.string().default(ProductState.NEW),
  delivery: z.boolean().default(false),
  defaultDeliveryLocation: z.string(),
  averageDeliveryTime: z.number().optional(),
})

export const checkoutSchema = z.object({
  deliveryAddress: z.string().min(1, "Delivery address is required"),
})

export const deliveryDateSchema = z.object({
  deliveryDate: z.date({
    required_error: "Please select a delivery date",
  }),
})

export type CheckoutFormValues = z.infer<typeof checkoutSchema>
export type DeliveryDateFormValues = z.infer<typeof deliveryDateSchema>