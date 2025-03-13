import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { UserIcon } from 'lucide-react'
import React, { Suspense } from 'react'
import { OnboardingForm } from '../_components/onboarding-form'

export default function OnboardingPage() {
  return (
    <Card className='m-2'>
      <CardHeader>
        <CardTitle className="flex items-center justify-center text-2xl font-bold">
          <UserIcon className="mr-3 h-8 w-8" />
          Complete Your Profile
        </CardTitle>
        <CardDescription className='max-w-sm px-2 text-center'>
          Let's personalize your experience and get you started on DormBiz.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Suspense fallback={<div>Loading...</div>}>
          <OnboardingForm />
        </Suspense>
      </CardContent>
    </Card>
  )
}