import { getCartItem } from '@/utils/data/cart'
import { OrderDetails } from './_components/order-details'
import { BackButton } from '@/components/back-button'

export default async function OrderPage({ params }: { params: { orderId: string } }) {
  const order = await getCartItem(params.orderId)
  return (
    <div className="flex flex-col min-h-screen w-full">
      {/* Header */}
      <div className="flex items-center justify-between h-16 w-full border-b py-2 px-6 fixed top-0 backdrop-blur-sm z-50 bg-background/80">
        <div className="flex justify-start gap-3">
          <BackButton />
          <h1 className="text-2xl font-bold">Order: {order?.createdAt.toLocaleDateString()}</h1>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-10 mt-16 max-w-5xl">
        <OrderDetails order={order!} />
        </div>
    </div>
  )
}