import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import React from 'react'
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, type CarouselApi } from '@/components/ui/carousel'
import Image from 'next/image'

interface PortfolioSectionProps {
    services: {
        name: string,
        images: string[]
    }[]
}

export const PortfolioSection = ({services}: PortfolioSectionProps) => {
    const [api, setApi] = React.useState<CarouselApi>()
    const [current, setCurrent] = React.useState(0)
    const [count, setCount] = React.useState(0)

    const formattedServices = services.flatMap((service) => {
        return service.images.map((image) => {
            return {
                name: service.name,
                image
            }
        })
    })
  

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
                    {formattedServices.map((service, index)=>(
                        <CarouselItem key={index}>
                            <div key={index} className="aspect-square relative w-full">
                                <Image
                                    src={service.image}
                                    alt={`Image ${index + 1}`}
                                    fill
                                    className="object-cover rounded-lg"
                                />
                                {index === current - 1 && (
                                    <div className="absolute top-8 left-14 px-3 py-1 font-semibold bg-transparent/75 rounded-lg">
                                        <span>{service.name}</span>
                                    </div>
                                )}
                            </div>
                        </CarouselItem>
                    ))}
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
