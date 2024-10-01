import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface ProviderDetailsProps {
  provider: {
    id: string
    name: string
    email: string
    image?: string
  }
}

export const ProviderDetails: React.FC<ProviderDetailsProps> = ({ provider }) => {
  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader className="flex flex-row items-center space-x-4">
        <Avatar className="w-16 h-16">
          <AvatarImage src={provider.image} alt={provider.name} />
          <AvatarFallback>{provider.name.slice(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>
        <div>
          <CardTitle>{provider.name}</CardTitle>
          <p className="text-sm text-muted-foreground">{provider.email}</p>
        </div>
      </CardHeader>
      <CardContent>
        {/* Add more provider details here as needed */}
      </CardContent>
    </Card>
  )
}