import { PaymentForm } from './_components/payment-form'
import { BackButton } from '@/components/back-button'

export default function PaymentPage({ params }: { params: { cartId: string } }) {
  return (
    <div className="flex flex-col min-h-screen w-full">
      {/* Header */}
      <div className="flex items-center justify-between h-16 w-full border-b py-2 px-6 fixed top-0 backdrop-blur-sm z-50 bg-background/80">
        <div className="flex justify-start gap-3">
          <BackButton />
          <h1 className="text-2xl font-bold">Complete Your Payment</h1>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto py-10 mt-16">
      <PaymentForm cartId={params.cartId} />
      </div>
    </div>
  )
}