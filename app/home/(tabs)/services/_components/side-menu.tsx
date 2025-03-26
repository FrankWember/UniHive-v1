"use client"

import React from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MessageCircle, UserRound, CircleUser, UserPlus, Heart, Store, CalendarIcon, LogOut, Menu, HomeIcon } from 'lucide-react'
import { useCurrentUser } from '@/hooks/use-current-user'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useIsMobile } from '@/hooks/use-mobile'
import { useMode } from '@/contexts/mode-context'

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {}

export function SideMenu({ className }: SidebarProps) {
  const router = useRouter()
  const user = useCurrentUser()
  const isMobile = useIsMobile()
  const { mode } = useMode()

  if (isMobile) return null

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="lg" variant="outline" className="flex items-center rounded-full p-0">
         
          <Avatar>
            <AvatarImage src={user?.image || ""} alt="Profile" className="object-cover" />
            <AvatarFallback>
              <CircleUser className="h-5 w-5" />
            </AvatarFallback>
          </Avatar>

          <div className='p-2'>
            <Menu className="h-4 w-4 mr-2" />
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[20rem]">
        <DropdownMenuLabel>Campus Marketplace</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {user && mode === "PROVIDER" ? (
          <DropdownMenuGroup>
            <DropdownMenuLabel className="text-muted-foreground">Seller</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => router.push('/home/services')} className='flex items-center gap-2'>
              <HomeIcon className='mr-2 h-4 w-4' />
              <span>Home</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => router.push('/home/services/favourites')} className='flex items-center gap-2'>
              <Heart className='mr-2 h-4 w-4' />
              <span>Favorites</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => router.push('/home/inbox')}>
              <MessageCircle className='mr-2 h-4 w-4' />
              <span>Messages</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => router.push(`/home/services/provider/${user?.id}/appointments`)}>
              <CalendarIcon className='mr-2 h-4 w-4' />
              <span>Appointments</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => router.push(`/home/services/provider/${user?.id}/my-services`)}>
              <Store className='mr-2 h-4 w-4' />
              <span>Manage Services</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => router.push('/home/settings')}>
              <UserRound className='mr-2 h-4 w-4' />
              <span>Account</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => router.push('/auth/sign-out')}>
              <LogOut className='mr-2 h-4 w-4' />
              <span>Logout</span>
            </DropdownMenuItem>
          </DropdownMenuGroup>
        ) : user ? (
          <DropdownMenuGroup>
            <DropdownMenuLabel className="text-muted-foreground">User</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => router.push('/home/services')} className='flex items-center gap-2'>
              <HomeIcon className='mr-2 h-4 w-4' />
              <span>Home</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => router.push('/home/services/favourites')}>
              <Heart className='mr-2 h-4 w-4' />
              <span>Favorites</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => router.push('/home/inbox')}>
              <MessageCircle className='mr-2 h-4 w-4' />
              <span>Messages</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => router.push('/home/services/my-bookings')}>
              <CalendarIcon className='mr-2 h-4 w-4' />
              <span>Bookings</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => router.push('/home/settings')}>
              <Store className='mr-2 h-4 w-4' />
              <span>Become a seller</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => router.push('/home/settings')}>
              <UserRound className='mr-2 h-4 w-4' />
              <span>Account</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => router.push('/auth/sign-out')}>
              <LogOut className='mr-2 h-4 w-4' />
              <span>Logout</span>
            </DropdownMenuItem>
          </DropdownMenuGroup>
        ) : (
          <DropdownMenuGroup>
            <DropdownMenuLabel className="text-muted-foreground">Visitor</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => router.push('/home/services')} className='flex items-center gap-2'>
              <HomeIcon className='mr-2 h-4 w-4' />
              <span>Home</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => router.push('/auth/sign-in')}>
              <CircleUser className='mr-2 h-4 w-4' />
              <span>Sign In</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => router.push('/auth/sign-up')}>
              <UserPlus className='mr-2 h-4 w-4' />
              <span>Sign Up</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => router.push('/home/settings')}>
              <Store className='mr-2 h-4 w-4' />
              <span>Become a seller</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => router.push('/home/services/favourites')}>
              <Heart className='mr-2 h-4 w-4' />
              <span>Favorites</span>
            </DropdownMenuItem>
          </DropdownMenuGroup>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
