"use client"

import { User as PrismaUser, UserRole } from '@prisma/client'
import React from 'react'
import { ThemeSwitcher } from '@/components/theme-switcher'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { PersonIcon } from '@radix-ui/react-icons'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { currentUser } from '@/lib/auth'
import { getUserById } from '@/utils/user'
import { redirect } from 'next/navigation'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { VerifiedIcon } from '@/components/icons/verified-icon'
import { BackButton } from '@/components/back-button'
import { BadgeDollarSign, CircleFadingArrowUp, CirclePlus, CircleUser, Lightbulb, Lock } from 'lucide-react'
import { ModeSwitcher } from './mode-switcher'
import { useIsMobile } from '@/hooks/use-mobile'
import { User } from 'next-auth'
import { UserSettingsForm } from './user-settings-form'
import { Separator } from '@/components/ui/separator'
import { ProfileImageForm } from './profile-image-form'

export const SettingsContent = ({ user, userData }: { userData: PrismaUser, user: User & { role: UserRole} }) => {
    const isMobile = useIsMobile()

  if (isMobile) return (
    <div className="flex flex-col justify-center items-center w-full max-w-xl space-y-8 py-24 px-4">
        <Card className="w-full flex gap-2 items-center p-4">
            <Avatar className='w-16 h-16 md:h-20 md:w-20'>
                <AvatarImage src={userData?.image || ""} alt="Profile" className='object-cover' />
                <AvatarFallback>{userData?.name?.[0]}</AvatarFallback>
            </Avatar>
            <CardHeader>
                <CardTitle className='flex gap-2'>{userData?.name}<VerifiedIcon /></CardTitle>
                <CardDescription>{userData?.phone}</CardDescription>
            </CardHeader>
        </Card>

        <div className='flex justify-end w-full'>
        <ModeSwitcher />
        </div>
        

        <div className="w-full flex flex-col gap-3">
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

        <div className="w-full flex flex-col gap-3">
        <h2 className="text-xl font-bold">Settings</h2>
        <Link href="/home/settings/profile">
            <Button variant="ghost"><CircleUser className='h-4 w-4 mr-2' /> Profile Information</Button>
        </Link>
        <Link href="/auth/reset-password">
            <Button variant="ghost"><Lock className='h-4 w-4 mr-2' /> Reset Password</Button>
        </Link>
        </div>

        <Card className="w-full mx-3">
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
    )

    return (
        <div className='grid grid-cols-2 gap-8 max-w-5xl w-full px-8 mt-[5rem]'>
            <div className="flex flex-col gap-3">
                <Card className="w-full flex gap-2 items-center p-4 bg-muted/40">
                    <Avatar className='w-16 h-16 md:h-20 md:w-20'>
                        <AvatarImage src={userData?.image || ""} alt="Profile" className='object-cover' />
                        <AvatarFallback>{userData?.name?.[0]}</AvatarFallback>
                    </Avatar>
                    <CardHeader className='w-full'>
                        <CardTitle className='flex gap-2'>{userData?.name}<VerifiedIcon /></CardTitle>
                        <CardDescription>{userData?.phone}</CardDescription>
                        <div className='flex justify-end w-full'>
                            <Link href="/home/settings/insights">
                                <Button variant="secondary"><Lightbulb className='h-4 w-4 mr-2' /> Insights</Button>
                            </Link>
                        </div>
                    </CardHeader>
                </Card>
                <Card className="w-full bg-muted/40">
                    <CardHeader>
                        <CardTitle>Theme & Mode</CardTitle>
                        <CardDescription>Change the theme and mode of the app.</CardDescription>
                    </CardHeader>
                    <CardContent className='flex justify-between'>
                        <div className="w-fit"><ThemeSwitcher mode="expanded" /></div>
                        <ModeSwitcher />
                    </CardContent>
                </Card>
                <Card className='bg-muted/40 h-full flex flex-col justify-between'>
                    <CardHeader>
                        <h1 className='text-2xl font-bold'>Authentiction Credentials</h1>
                        <Separator className='my-10' />
                        <CardTitle>{userData.email}</CardTitle>
                        <CardDescription>**********</CardDescription>
                    </CardHeader>
                    <CardFooter className='flex justify-end'>
                        <Link href="auth/reset-password">
                            <Button><Lock className='h-4 w-4 mr-2' /> Reset Password</Button>
                        </Link>
                    </CardFooter>
                </Card>
            </div>
            <div className="flex flex-col gap-3">
                <ProfileImageForm user={userData!} />
                <UserSettingsForm userData={userData} />
            </div>
        </div>
    )
}
