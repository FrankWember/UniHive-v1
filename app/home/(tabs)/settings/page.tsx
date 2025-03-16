
import { currentUser } from '@/lib/auth'
import { getUserById } from '@/utils/user'
import { redirect } from 'next/navigation'
import { BackButton } from '@/components/back-button'
import { ProviderNav } from '../services/provider/[providerId]/_components/provider-nav'
import { SettingsContent } from './_components/settings-content'
import { SideMenu } from '../services/_components/side-menu'

export default async function SettingsPage() {
  const user = await currentUser()
  const userData = await getUserById(user?.id!)

  if (!user?.id) {
    const callbackUrl = encodeURIComponent('/home/settings');
    redirect(`/auth/sign-in?callbackUrl=${callbackUrl}`);
    return
  }

  return (
    <div className="flex flex-col items-center min-h-screen w-screen">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 h-14 w-full border-b py-2 px-6 fixed top-0 backdrop-blur-sm z-50 bg-background/80">
        <div className='flex justify-start gap-3'>
            <BackButton />
            <h1 className="text-2xl font-bold">Account</h1>
        </div>
        <SideMenu />
      </div>

      <div className='w-full pt-10'>
        <ProviderNav />
      </div>

      <SettingsContent user={user} userData={userData!} />
    </div>
  )
}