import { Suspense } from 'react'
import { ThemeSwitcher } from '@/components/theme-switcher'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { PersonIcon } from '@radix-ui/react-icons'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { UserSettingsForm } from './_components/user-settings-form'
import { currentUser } from '@/lib/auth'
import { getUserById } from '@/utils/user'
import { Skeleton } from '@/components/ui/skeleton'

export default async function SettingsPage() {
  const user = await currentUser()
  const userData = await getUserById(user?.id!)

  return (
    <div className="flex flex-col min-h-screen w-screen">
      {/* Header */}
      <div className="flex items-center justify-between h-14 w-full border-b py-2 px-6 fixed top-0 backdrop-blur-sm z-50 bg-background/80">
        <h1 className="text-2xl font-bold">Settings</h1>
      </div>

      {/* Content */}
      <div className="flex flex-col items-center w-full space-y-8 py-20">
        <Card className="w-full max-w-md mx-3">
          <CardHeader>
            <CardTitle>User Settings</CardTitle>
            <CardDescription>Update your user settings like your name, student ID, and phone number.</CardDescription>
          </CardHeader>
          <CardContent>
            <Suspense fallback={<Skeleton className="w-full h-full" />}>
              <UserSettingsForm userData={userData!} />
            </Suspense>
          </CardContent>
        </Card>

        <Card className="w-full max-w-md mx-3">
          <CardHeader>
            <CardTitle>Theme</CardTitle>
            <CardDescription>Change the theme of the app.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="w-fit"><ThemeSwitcher mode="expanded" /></div>
          </CardContent>
        </Card>

        <Card className="w-full max-w-md mx-3">
          <CardHeader>
            <CardTitle>Account Actions</CardTitle>
            <CardDescription>Change your password or sign out of the app.</CardDescription>
          </CardHeader>
          <CardContent className="flex items-center gap-3">
            <Button variant="outline">
              <Link href="/auth/reset-password" className="flex gap-2 items-center">
                Reset Password
              </Link>
            </Button>
            <Button variant="destructive">
              <Link href="/auth/sign-out" className="flex gap-2 items-center">
                <PersonIcon /> Sign Out
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}