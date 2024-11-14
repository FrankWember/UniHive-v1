import React from 'react'
import { Card, CardTitle, CardDescription, CardFooter } from './ui/card'
import Link from 'next/link'
import { Button } from './ui/button'

export const ComingSoon = () => {
  return (
    <div className="w-full h-full flex items-center justify-center">
        <Card>
            <CardTitle>Coming Soon</CardTitle>
            <CardDescription>This feature is currently under development.</CardDescription>
            <CardFooter>
                <Link href="/home">
                    <Button>
                        Go Back Home 
                    </Button>
                </Link>
            </CardFooter>
        </Card>
        
    </div>
  )
}
