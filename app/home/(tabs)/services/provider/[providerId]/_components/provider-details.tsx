import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { User, Mail, Phone } from 'lucide-react'

interface ProviderDetailsProps {
  provider: {
    id: string
    name: string
    image: string | undefined
    email: string
    phone: string | null
  }
}

export const ProviderDetails: React.FC<ProviderDetailsProps> = ({ provider }) => {
  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center space-x-4">
        <Avatar className="h-20 w-20">
          <AvatarImage src={provider.image} alt={provider.name} />
          <AvatarFallback>{provider.name[0]}</AvatarFallback>
        </Avatar>
        <div>
          <CardTitle className="text-3xl">{provider.name}</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        {/* Add more provider details here if needed */}
      </CardContent>
    </Card>
  )
}