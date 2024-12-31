import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import React, { Suspense } from 'react'
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, type CarouselApi } from '@/components/ui/carousel'
import { Skeleton } from '@/components/ui/skeleton'
import Image from 'next/image'

interface PortfolioSectionProps {
    images: string[],
}

export const PortfolioSection = ({images}: PortfolioSectionProps) => {
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
            <CardDescription>Check out Other Works from this Provider</CardDescription>
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
                
                <div className="absolute bottom-8 right-14 flex items-center gap-2">
                    <CarouselPrevious />
                    <CarouselNext />
                </div>
            </Carousel>
            <div className="py-1 text-center text-sm text-muted-foreground">
                Image {current} of {count}
            </div>
        </CardContent>
    </Card>
  )
}
