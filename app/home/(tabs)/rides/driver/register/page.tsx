import { BackButton } from '@/components/back-button'
import { Card } from '@/components/ui/card'
import React from 'react'

const DriverRegistrationPage = () => {
  return (
    <div className='flex flex-col min-h-screen w-screen'>
        <div className='flex p-3 items-center fixed top-0 w-full'>
            <BackButton />
            <h1 className='text-2xl font-bold'>Register as Driver</h1>
        </div>
        <div className='flex flex-col items-center justify-center w-full h-full'>
            {/* <Card className='w-full max-w-md'>

            </Card> */}
        </div>
    </div>
  )
}

export default DriverRegistrationPage