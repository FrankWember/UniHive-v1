import { currentUser } from '@/lib/auth'
import { getUserById } from '@/utils/user'
import { redirect } from 'next/navigation'
import { AccountUpgrade } from '../_components/account-upgrade'

export default async function SettingsPage() {
  const user = await currentUser()
  const userData = await getUserById(user?.id!)

  if (!user?.id) {
    const callbackUrl = encodeURIComponent('/home/settings');
    redirect(`/auth/sign-in?callbackUrl=${callbackUrl}`);
    return
  }

  return (
    <div className='flex flex-col w-full h-full justify-center items-center'>
        <AccountUpgrade />
    </div>
  )
}