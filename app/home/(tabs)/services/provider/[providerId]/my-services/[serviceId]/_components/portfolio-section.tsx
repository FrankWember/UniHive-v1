import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import React, { Suspense } from 'react'
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, type CarouselApi } from '@/components/ui/carousel'
import { Skeleton } from '@/components/ui/skeleton'
import Image from 'next/image'
import Link from 'next/link'

interface PortfolioSectionProps {
    images: string[],
    providerId: string
}

export const PortfolioSection = ({images, providerId}: PortfolioSectionProps) => {
    const [api, setApi] = React.useState<CarouselApi>()
    const [current, setCurrent] = React.useState(0)
    const [count, setCount] = React.useState(0)
  

    React.useEffect(() => {
        if (!api) {
        return
        }
    
        setCount(api.scrollSnapList().length)
        setCurrent(api.selectedScrollSnap() + 1)
    
        api.on("select", () => {
        setCurrent(api.selectedScrollSnap() + 1)
        })
    }, [api])

  return (
    <Card>
        <CardHeader>
            <CardTitle>Portfolio</CardTitle>
            <CardDescription>Check out Other Works from this Provider <Link href={`/home/services/provider/${providerId}`} className="underline text-foreground">More</Link></CardDescription>
        </CardHeader>
        <CardContent>
            <Carousel setApi={setApi} className="w-full">
                <CarouselContent>
                    {images.length > 0 ? images.map((image, index)=>(
                        <CarouselItem key={index}>
                            <div key={index} className="aspect-square relative w-full">
                                <Suspense fallback={<Skeleton className="w-full h-full" />}>
                                    <Image
                                        src={image}
                                        alt={`Image ${index + 1}`}
                                        fill
                                        className="object-cover rounded-lg"
                                    />
                                </Suspense>
                            </div>
                        </CarouselItem>
                    )) : (
                        <div className="aspect-square relative w-full text-muted-foreground text-lg flex justify-center items-center">
                            <p>Empty Portfolio</p>
                        </div>
                    )}
                </CarouselContent>
                
                <div className="absolute bottom-8 right-14 flex items-center gap-2 z-20">
                    <CarouselPrevious />
                    <CarouselNext />
                </div>
                <div className="absolute bottom-6 left-0 right-0 flex w-full items-center justify-center gap-1">
                    {images.map((image, idx)=>(
                    <div 
                        key={idx} 
                        className={`w-2 h-2 rounded-full bg-white/70 border-gray-800 cursor-pointer ${idx === current-1 ? "bg-white h-3 w-3" : ""}`} 
                        onClick={() => setCurrent(idx)}
                        data-carousel-button
                        />
                    ))}
                </div>
            </Carousel>
            <div className="py-1 text-center text-sm text-muted-foreground">
                Image {current} of {count}
            </div>
        </CardContent>
    </Card>
  )
}
