import React, { Suspense } from 'react'
import { currentUser } from '@/lib/auth'
import { getUserById } from '@/utils/user'
import { redirect } from 'next/navigation'
import { ProfileImageForm } from '../_components/profile-image-form'
import { UserSettingsForm } from '../_components/user-settings-form'
import { Skeleton } from '@/components/ui/skeleton'
import { BackButton } from '@/components/back-button'

const page = async () => {
    const user = await currentUser()
  const userData = await getUserById(user?.id!)

  if (!user?.id) {
    const callbackUrl = encodeURIComponent('/home/settings');
    redirect(`/auth/sign-in?callbackUrl=${callbackUrl}`);
    return
  }

  return (
    <div className="flex flex-col min-h-screen w-screen">
        {/* Header */}
        <div className="flex items-center justify-start gap-3 h-14 w-full border-b py-2 px-6 fixed top-0 backdrop-blur-sm z-50 bg-background/80">
            <BackButton />
            <h1 className="text-2xl font-bold">Personal Information</h1>
        </div>

        {/* Content */}
        <div className="flex flex-col items-center w-full max-w-4xl space-y-8 py-24 px-4">
            <Suspense fallback={<Skeleton className="w-full h-full" />}>
                <ProfileImageForm user={userData!} />
                <UserSettingsForm userData={userData!} />
            </Suspense>
        </div>
    </div>
  )
}

export default page