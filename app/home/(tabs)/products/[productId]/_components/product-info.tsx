"use client"

import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from '@/components/ui/separator'
import { Product, User } from '@prisma/client'
import { ShieldCheck, Star, Truck, Heart } from 'lucide-react'
import { Share1Icon } from "@radix-ui/react-icons"
import React from 'react'
import { VerifiedIcon } from "@/components/icons/verified-icon"
import { format } from 'date-fns'
import { useRouter } from 'next/navigation'
import { useCurrentUser } from '@/hooks/use-current-user'
import { useToast } from '@/hooks/use-toast'
import { useMutation, useQuery } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { likeProduct } from '@/actions/products'
import { ProductRequest } from './product-request'
import { BeatLoader } from 'react-spinners'
import { APP_URL } from '@/constants/paths'

interface ProductInfoProps {
    product: Product & {
        seller: User
    }
    addToCart: (buyNow?: boolean) => void
}

export const ProductInfo = ({product, addToCart}: ProductInfoProps) => {
    const router = useRouter()
    const user = useCurrentUser()
    const [isLiked, setIsLiked] = React.useState(false)
    const newChat = useMutation(api.chats.createChat)
    const {toast} = useToast()
    const [isSharing, setIsSharing] = React.useState(false)
    const [isLiking, setIsLiking] = React.useState(false)
    const [creatingChat, setCreatingChat] = React.useState(false)

    let existingChat = undefined
    if (user && user.id && product.sellerId) {
        existingChat = useQuery(api.chats.getChatByUserIds, {
            customerId: user.id,
            sellerId: product.sellerId
        })
    }

    React.useEffect(() => {
        const fetchLikeStatus = async () => {
          try {
            const response = await fetch(`/api/products/${product.id}/favourites`)
            const data = await response.json()
            setIsLiked(data.isLiked)
          } catch (error) {
            console.error('Error fetching like status:', error)
          }
        }
    
        fetchLikeStatus()
      }, [product.id])

    async function likeThisProduct() {
        setIsLiking(true)
        if (!user) {
          toast({
              title: 'Please log in to like a product',
              description: 'You need to be logged in to like a product.',
          })
          return
        }
        const like = await likeProduct(product.id)
        setIsLiked(like)
        setIsLiking(false)
      }

    const createChat = async () => {
        try {
            setCreatingChat(true)
            if (!user) {
                const callbackUrl = encodeURIComponent(`/home/products/${product.id}`)
                router.push(`/auth/sign-in?callbackUrl=${callbackUrl}`)
                return
            }
            let chatId = ''
            if (existingChat){
                chatId = existingChat?._id
            } else {
                chatId = await newChat({ sellerId: product.sellerId, customerId: user.id!, type: 'products' })
            }
            router.push(`/home/inbox?chatId=${chatId}`)
        } catch (error) {
            console.error('Error creating chat:', error)
            toast({
                title: 'Failed to create chat',
                description: 'Please try again later',
                variant: 'destructive'
            })
        } finally {
            setCreatingChat(false)
        }
    }

    const share = async () => {
        try {
            const discountedPrice = product.discount? product.price - (product.price * product.discount / 100) : product.price
            const message = `${product.name} Service.\nAvailable at $${discountedPrice}\nCheck it out here:`
            const productUrl = `${APP_URL}/home/products/${product.id}`
            const fullMessage = `${message} ${productUrl}`

            setIsSharing(true)
            if (navigator.share) {
                try {
                    await navigator.share({
                        title: product.name, 
                        text: message, 
                        url: productUrl,
                    })
                } catch (error) {
                    console.error('Error sharing:', error)
                    toast({
                        title: 'Failed to share',
                        description: 'Please try again later',
                    })
                }
            } else {
                // Share to WhatsApp
                const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(fullMessage)}`
                window.open(whatsappUrl, '_blank')
                navigator.clipboard.writeText(fullMessage)
                toast({ 
                    title: 'Copied to clipboard', 
                    description: 'The link has been copied to your clipboard',
                })
            }
        } catch (error) {
            console.error('Failed to copy to clipboard:', error)
            toast({
                title: 'Failed to copy to clipboard',
                description: 'Please try again later',
            })
        } finally {
            setIsSharing(false)
        }
    }


  return (
    <div className='flex flex-col gap-4'>
        <p className='text-2xl'>{product.name}</p>
        {product.discount>0 ? (
            <div className='flex items-center space-x-2 text-2xl font-bold'>
                <span className="font-bold "><span className="text-green-500">$</span>{(product.price - (product.price * (product.discount || 0) / 100)).toFixed(2)}</span>
                <span className='text-muted-foreground line-through text-lg'>${product.price.toFixed(2)}</span>
            </div>
        ):((
            <span>${product.price.toFixed(2)}</span>
        ))}
        <div className='flex gap-3 font-mono items-center'>
            <span className='underline'>{product.brand}</span>
            <div className="h-[5px] w-[5px] bg-foreground rounded-full"></div>
            <span>{product.state}</span>
            <div className="h-[5px] w-[5px] bg-foreground rounded-full"></div>
            <span>{product.stock} in stock</span>
        </div>
        <div className='flex gap-2'>
            <Button onClick={() => addToCart(true)}>Buy now</Button>
            <ProductRequest product={product} />
            <Button variant="outline" size="icon" onClick={share} disabled={isSharing}>
                {isSharing ? <BeatLoader /> : <Share1Icon />}
            </Button>
            <Button variant="outline" size="icon" onClick={likeThisProduct} disabled={isLiking}>
                {isLiking ? <BeatLoader /> : <Heart className={`h-4 w-4 ${isLiked ? 'fill-red-500 text-red-500' : ''}`} />}
            </Button> 
        </div>
        <div className="grid grid-cols-8 gap-y-6 my-4">
            <ShieldCheck className="h-8 w-8" />
            <div className="col-span-7 flex flex-col">
                <h3 className="font-semibold">Efficient Bookings</h3>
                <p className="text-sm text-muted-foreground">We offer a fast and efficient booking process. Schedule your product appointment in seconds</p>
            </div>
            <Star className="h-8 w-8" />
            <div className="col-span-7 flex flex-col">
                <h3 className="font-semibold">Trusted Reviews</h3>
                <p className="text-sm text-muted-foreground">All review are verified and originate only from authentic users and customers for this product</p>
            </div>
            <Truck className="h-8 w-8" />
            {product.delivery ? (
                <div className="col-span-7 flex flex-col">
                    <h3 className="font-semibold">Free Delivery</h3>
                    <p className="text-sm text-muted-foreground">Get Free delivery any where on campus {product.defaultDeliveryLocation && `or meet at ${product.defaultDeliveryLocation}`} in {product.averageDeliveryTime} days</p>
                </div>
            ):(
                <div className="col-span-7 flex flex-col">
                    <h3 className="font-semibold">Location</h3>
                    <p className="text-sm text-muted-foreground">Meet the seller at {product.defaultDeliveryLocation} for your order in about {product.averageDeliveryTime} days.</p>
                </div>
            )}
        </div>
        <Separator />
        <div className='flex flex-col space-y-4'>
            <p className="text-muted-foreground text-sm whitespace-pre-line">{product.description}</p>
            <p className="flex text-base underline font-semibold gap-3">
                {product.categories.map((cat, idx)=>(
                    <span key={idx}>#{cat}</span>
                ))}
            </p>
            <p className="text-base uppercase text-muted-foreground">Listed on {product.createdAt.toLocaleDateString()}</p>
        </div>
        <Separator />
        <div className='flex flex-col space-y-4'>
            <div className="flex gap-6 ">
                <Avatar className="h-16 w-16">
                    <AvatarImage src={product.seller.image || undefined} alt={product.seller.name || 'provider'} className="object-cover" />
                    <AvatarFallback>{product.seller.name ? product.seller.name[0] : 'S'}</AvatarFallback>
                </Avatar>
                <span className="flex flex-col gap-1 items-center justify-start h-16">
                    <span className="flex items-center justify-start text-lg font-semibold gap-1">
                        {product.seller.name}
                        <VerifiedIcon className="h-6 w-6" />
                    </span>
                    <span className="text-sm text-muted-foreground">Since {format(product.seller.createdAt, 'MMMM yyyy')}</span>
                </span>
            </div>
            <div className='flex gap-3 justify-end'>
                <Button onClick={() => router.push(`/home/products/sellers/${product.seller.id}`)}>Portfolio</Button>
                <Button variant='outline' onClick={createChat} disabled={creatingChat}>
                    {creatingChat ? <BeatLoader /> : "Contact"}
                </Button>
            </div>
        </div>
        <Separator />
    </div>
  )
}
