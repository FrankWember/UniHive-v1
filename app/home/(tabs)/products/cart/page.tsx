import { getCart } from '@/utils/data/cart'
import { CartContent } from './_components/cart-content'
import { CartSummary } from './_components/cart-summary'
import { BackButton } from '@/components/back-button'

export default async function CartPage() {
    const cart = await getCart()
  return (
    <div className="flex flex-col min-h-screen w-full">
      {/* Header */}
      <div className="flex items-center justify-between h-16 w-full border-b py-2 px-6 fixed top-0 backdrop-blur-sm z-50 bg-background/80">
        <div className="flex justify-start gap-3">
          <BackButton />
          <h1 className="text-2xl font-bold">Your Cart</h1>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto py-10 mt-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <CartContent cart={cart} />
          </div>
          <div>
            <CartSummary cart={cart} />
          </div>
        </div>
      </div>
    </div>
  )
}