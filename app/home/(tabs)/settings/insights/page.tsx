import { BackButton } from '@/components/back-button'
import { getProviderInsights } from '@/utils/data/services'
import { calculateServiceReviewMetrics } from '@/utils/helpers/reviews'
import React from 'react'
import Insights from './_components/insights'
import { SideMenu } from '../../services/_components/side-menu'

const page = async () => {
  const myData = await getProviderInsights()

  const reviewList = myData?.services.map(service=>{
    const reviewMetrics = calculateServiceReviewMetrics(service.reviews)
    return {
      serviceId: service.id,
      serviceName: service.name,
      numberOfReviews: service.reviews.length,
      overall: reviewMetrics?.overall ?? 0,
      cleanliness: reviewMetrics?.cleanliness ?? 0,
      accuracy: reviewMetrics?.accuracy ?? 0,
      checkIn: reviewMetrics?.checkIn ?? 0,
      communication: reviewMetrics?.communication ?? 0,
      location: reviewMetrics?.location ?? 0,
      value: reviewMetrics?.value ?? 0,
    }
  })
  return (
    <div className="flex flex-col items-center min-h-screen w-screen">
      {/* Header */}
      <div className="flex items-center justify-start gap-3 h-14 w-full border-b py-2 px-6">
        <div className="flex justify-start items-center gap-3">
          <BackButton />
          <h1 className="text-2xl font-bold">Insights</h1>
        </div>
        <SideMenu />
      </div>
      <div className='pt-8'>
        <Insights ratingsList={reviewList!} />
      </div>
    </div>
  )
}

export default page