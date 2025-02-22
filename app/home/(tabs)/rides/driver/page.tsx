import React from 'react'
import { SideMenu } from './_components/side-menu'
import { DashboardSection } from './_components/dashboard-section'

const page = () => {
    return (
        <div className="flex flex-col h-full w-full pb-24">
            <div className="flex justify-between w-screen h-16 p-4 fixed top-0 left-0 z-20 border-b bg-transparent/60 backdrop-blur-sm">
                <SideMenu />
            </div>
            <div className="flex flex-col gap-4 py-20 p-4">
                <DashboardSection />
            </div>
        </div>
    )
}

export default page