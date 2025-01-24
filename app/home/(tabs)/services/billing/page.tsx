import { currentUser } from '@/lib/auth'
import React from 'react'
import { redirect } from 'next/navigation'
import { BackButton } from '@/components/back-button'
import { SubscriptionTiers } from './_components/subscription-tiers'
import { getUserSubscription } from '@/utils/data/services'
import { SubscriptionContent } from './_components/subscription-content'
const SubscriptionPage = async () => {
    const user = await currentUser()
    if (!user || !user.id) {
        redirect(`/auth/sign-in?callbackUrl=${encodeURIComponent("/home/services/subscription")}`)
    }

    const subscription = await getUserSubscription(user.id!)

  return (
    <div className="flex flex-col min-h-screen w-full">
      {/* Header */}
      <div className="flex items-center justify-start gap-4 h-16 w-full border-b py-2 px-6 fixed top-0 backdrop-blur-sm z-50 bg-background/80">
        <BackButton />
        <h1 className="text-2xl font-bold truncate">Billing</h1>
      </div>

      {/* Content */}
      <div className='w-full h-full flex justify-center items-center'>
        <div className="flex flex-col lg:flex-row gap-8 p-4 py-24 items-center justify-center w-full h-full max-w-5xl">
          <SubscriptionContent subscription={subscription} />
          <SubscriptionTiers />
        </div>
      </div>
    </div>
  )
}

export default SubscriptionPage