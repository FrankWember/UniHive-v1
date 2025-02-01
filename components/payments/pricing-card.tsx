"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Check } from "lucide-react"
import { PaymentModal } from "./payment-modal"

interface PricingCardProps {
  name: string
  price: number
  period: string
  features: string[]
  featured?: boolean
  className?: string
}

export function PricingCard({ name, price, period, features, featured, className }: PricingCardProps) {
  const [showPaymentModal, setShowPaymentModal] = useState(false)

  return (
    <>
      <div className={`relative p-6 bg-muted rounded-lg border ${className}`}>
        {featured && (
          <div className="absolute -top-2 right-4 bg-white text-black px-3 py-1 rounded-full text-sm font-medium">
            Featured
          </div>
        )}
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium text-white">{name}</h3>
            <div className="mt-2 flex items-baseline">
              <span className="text-5xl font-bold tracking-tight text-white">${price}</span>
              <span className="ml-1 text-sm font-medium text-zinc-400">/{period}</span>
            </div>
          </div>
          <Button className="w-full" onClick={() => setShowPaymentModal(true)}>
            Get {name}
          </Button>
          <ul className="space-y-3">
            {features.map((feature, index) => (
              <li key={index} className="flex items-center gap-2">
                <Check className="h-4 w-4 text-zinc-400" />
                <span className="text-sm text-zinc-300">{feature}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        plan={{ name, price, period }}
      />
    </>
  )
}

