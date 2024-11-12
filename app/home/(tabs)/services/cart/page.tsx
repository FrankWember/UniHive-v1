import { redirect } from "next/navigation"
import { getBookingsByUserId } from "@/actions/service-bookings"
import { CartContent } from "./_components/cart-content"
import { BackButton } from "@/components/back-button"
import { currentUser } from "@/lib/auth"

export default async function CartPage() {
  const user = await currentUser()

  if (!user) {
    redirect("/login")
  }

  const bookings = await getBookingsByUserId(user.id!)

  return (
    <div className="flex flex-col min-h-screen w-screen">
      {/* Header */}
      <div className="flex items-center justify-start gap-3 h-14 w-full border-b py-2 px-6 fixed top-0 backdrop-blur-sm z-50 bg-background/80">
        <BackButton />
        <h1 className="text-2xl font-bold">My Cart</h1>
      </div>

      {/* Content */}
      <div className="flex w-screen justify-center pb-24 pt-20">
        <CartContent bookings={bookings} userId={user.id!} />
      </div>
    </div>
  )
}