import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { CalendarDays } from 'lucide-react'
import { User } from '@prisma/client'

interface SellerProfileProps {
  seller: User
}

export function SellerProfile({ seller }: SellerProfileProps) {
  return (
    <Card className="mb-6">
      <CardHeader className="flex flex-row items-center gap-4">
        <Avatar className="h-20 w-20">
          <AvatarImage src={seller.image || undefined} alt={seller.name || 'Seller'} />
          <AvatarFallback>{seller.name ? seller.name[0] : 'S'}</AvatarFallback>
        </Avatar>
        <div>
          <CardTitle className="text-2xl">{seller.name}</CardTitle>
          <div className="flex items-center text-sm text-muted-foreground">
            <CalendarDays className="mr-1 h-4 w-4" />
            Joined {new Date(seller.createdAt).toLocaleDateString()}
          </div>
        </div>
      </CardHeader>
    </Card>
  )
}