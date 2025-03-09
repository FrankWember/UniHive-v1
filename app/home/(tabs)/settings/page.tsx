import { ThemeSwitcher } from '@/components/theme-switcher'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { PersonIcon } from '@radix-ui/react-icons'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { currentUser } from '@/lib/auth'
import { getUserById } from '@/utils/user'
import { redirect } from 'next/navigation'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { VerifiedIcon } from '@/components/icons/verified-icon'
import { BackButton } from '@/components/back-button'
import { BadgeDollarSign, CircleFadingArrowUp, CirclePlus, CircleUser, Lightbulb, Lock } from 'lucide-react'

export default async function SettingsPage() {
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
        <h1 className="text-2xl font-bold">Account</h1>
      </div>

      {/* Content */}
      <div className="flex flex-col items-center w-full max-w-4xl space-y-8 py-24 px-4">
        <Card className="w-full max-w-md flex gap-2 items-center p-4">
          <Avatar className='w-16 h-16 md:h-20 md:w-20'>
            <AvatarImage src={userData?.image || ""} alt="Profile" className='object-cover' />
            <AvatarFallback>{userData?.name?.[0]}</AvatarFallback>
          </Avatar>
          <CardHeader>
            <CardTitle className='flex gap-2'>{userData?.name}<VerifiedIcon /></CardTitle>
            <CardDescription>{userData?.phone}</CardDescription>
          </CardHeader>
        </Card>

        <div className="w-full max-w-md flex flex-col gap-3">
          <h2 className="text-xl font-bold">DormBiz Skills</h2>
          {user.role === "SELLER" || user.role === "ADMIN" ? (
            <>
              <Link href="/home/settings/insights">
                <Button variant="ghost"><Lightbulb className='h-4 w-4 mr-2' /> Insights</Button>
              </Link>
              <Link href="/home/settings/earnings">
                <Button variant="ghost"><BadgeDollarSign className='h-4 w-4 mr-2' /> Earnings</Button>
              </Link>
              <Link href="/home/services/add">
                <Button variant="ghost"><CirclePlus className='h-4 w-4 mr-2' /> Create a Service</Button>
              </Link>
            </>
          ) : (
              <Link href="/home/settings/upgrade">
                <Button variant="ghost"><CircleFadingArrowUp className='h-4 w-4 mr-2' /> Upgrade</Button>
              </Link>
          )}
        </div>

        <div className="w-full max-w-md flex flex-col gap-3">
          <h2 className="text-xl font-bold">Settings</h2>
          <Link href="/home/settings/profile">
            <Button variant="ghost"><CircleUser className='h-4 w-4 mr-2' /> Profile Information</Button>
          </Link>
          <Link href="auth/reset-password">
            <Button variant="ghost"><Lock className='h-4 w-4 mr-2' /> Reset Password</Button>
          </Link>
        </div>

        <Card className="w-full max-w-md mx-3">
          <CardHeader>
            <CardTitle>Theme</CardTitle>
            <CardDescription>Change the theme of the app.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="w-fit"><ThemeSwitcher mode="expanded" /></div>
          </CardContent>
        </Card>

        <div className='flex w-full justify-end'>
          <Button variant="destructive">
            <Link href="/auth/sign-out" className="flex gap-2 items-center">
              <PersonIcon /> Sign Out
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}