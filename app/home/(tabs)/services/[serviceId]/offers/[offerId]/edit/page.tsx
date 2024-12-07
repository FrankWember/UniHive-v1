import React from 'react'
import { BackButton } from '@/components/back-button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { currentUser } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { EditOfferForm } from './_components/edit-offer-form'
import { getServiceOfferById } from '@/utils/data/services'

const EditOfferPage = async ({ params }: { params: { offerId: string } }) => {
    const offer = await getServiceOfferById(params.offerId)
    const user = await currentUser()
    if (!user?.id) {
      const callbackUrl = encodeURIComponent('/home/services/add');
      redirect(`/auth/sign-in?callbackUrl=${callbackUrl}`);
      return
    }
    return (
      <div className="flex flex-col min-h-screen w-screen">
        {/* Header */}
        <div className="flex items-center justify-start gap-3 h-14 w-full border-b py-2 px-6 fixed top-0 backdrop-blur-sm z-50 bg-background/80">
          <BackButton />
          <h1 className="text-2xl font-bold">Edit Offer</h1>
        </div>
  
        {/* Content */}
        <div className="flex w-screen justify-center mt-5">
          <Card className='max-w-md h-fit my-20 mx-2'>
            <CardHeader>
              <CardTitle>Edit Offer</CardTitle>
              <CardDescription>You can edit  your service offers, allowing users to be able to book</CardDescription>
            </CardHeader>
            <CardContent>
              <EditOfferForm offer={offer!} />
            </CardContent>
          </Card>
        </div>
      </div>
    )
}

export default EditOfferPage