import * as z from "zod"

export const SignInSchema = z.object({
  email: z.string({required_error: "You must have an email"}).email(),
  password: z.string({required_error: "You must use a password"}).min(8),
})