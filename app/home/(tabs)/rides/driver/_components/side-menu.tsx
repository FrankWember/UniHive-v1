"use client"

import { Button } from '@/components/ui/button'
import { PanelRight, PlusCircle, History, BarChart3 } from 'lucide-react'
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu'
import React from 'react'
import { useRouter } from 'next/navigation'
import { DashboardIcon, ExitIcon } from '@radix-ui/react-icons'

export const SideMenu = () => {
    const router = useRouter()
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button size="icon" variant="outline">
                    <PanelRight className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
                <div className="px-2 py-2">
                    <h2 className="text-2xl font-bold mb-1">Campus Driver</h2>
                    <p className="text-sm text-muted-foreground mb-4">
                        Manage your driver profile, view your rides, and more.
                    </p>
                </div>
                <DropdownMenuItem onClick={()=>router.push("/home/rides/driver")} >
                    <DashboardIcon className="mr-2 h-4 w-4" />
                    <span>Dashboard</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={()=>router.push("/home/rides/driver/register")}>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    <span>Register as Driver</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={()=>router.push("/home/rides/driver/history")}>
                    <History className="mr-2 h-4 w-4" />
                    <span>My History</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={()=>router.push("/home/rides/driver/analytics")}>
                    <BarChart3 className="mr-2 h-4 w-4" />
                    <span>Analytics</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={()=>router.push("/home/rides/driver")}>
                    <ExitIcon className="mr-2 h-4 w-4" />
                    <span>Exit</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
