import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { User, Mail, Phone } from 'lucide-react'
import { VerifiedIcon } from '@/components/icons/verified-icon'

interface ProviderDetailsProps {
  provider: {
    id: string
    name: string
    image: string | undefined
    email: string
    phone: string | null,
    isOnboarded: boolean
    createdAt: Date
  }
}

export const ProviderDetails: React.FC<ProviderDetailsProps> = ({ provider }) => {
  return (
    <Card className="w-full my-4">
      <CardHeader className="flex flex-row items-center space-x-4">
        <Avatar className="h-36 w-36 md:h-48 md:w-48">
          <AvatarImage src={provider.image} alt={provider.name} className="object-cover" />
          <AvatarFallback>{provider.name[0]}</AvatarFallback>
        </Avatar>
        <div>
          <CardTitle className="text-3xl flex items-center">{provider.name}<VerifiedIcon className="ml-3 h-8 w-8" /></CardTitle>
          <span className='text-muted-foreground'>Since <span className='text-primary-foreground'>{new Intl.DateTimeFormat('default', { month: 'long', year: 'numeric' }).format(provider.createdAt)}</span></span>
        </div>
      </CardHeader>
      <CardContent>
        {/* Add more provider details here if needed */}
      </CardContent>
    </Card>
  )
}