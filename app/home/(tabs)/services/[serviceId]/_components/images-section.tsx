"use client"
import { useIsMobile } from '@/hooks/use-mobile'
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, type CarouselApi } from "@/components/ui/carousel"
import Image from 'next/image'
import React, { useState } from 'react'

interface Props {
    service: {
        name: string
        images: string[]
    }
}

export const ImagesSection = ({
    service
}: Props) => {
    const isMobile = useIsMobile()

    // Carousel stuff
    const [api, setApi] = React.useState<CarouselApi>()
    const [current, setCurrent] = React.useState(0)
    const [count, setCount] = React.useState(0)
    const [currentImgIndex, setCurrentImageIndex] = useState(0)

    React.useEffect(() => {
        if (!api) {
          return
        }
     
        setCount(api.scrollSnapList().length)
        setCurrent(api.selectedScrollSnap() + 1)
     
        api.on("select", () => {
          setCurrent(api.selectedScrollSnap() + 1)
          setCurrentImageIndex(api.selectedScrollSnap())
        })
      }, [api])

    if (isMobile) return (
        <div className="flex flex-col gap-2">
            <Carousel setApi={setApi} className="w-full">
                <CarouselContent>
                    {service.images.map((image, index) => (
                    <CarouselItem key={index}>
                        <div className="aspect-square relative w-full">
                        <Image
                            src={image}
                            alt={`${service.name} - Image ${index + 1}`}
                            fill
                            className="object-cover rounded-b-lg"
                        />
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
        </div>
    )

    return (
        <div className='flex flex-col justify-start w-1/2 gap-3 p-4 pr-20'>
            <Carousel setApi={setApi} className="w-full mx-auto">
            <CarouselContent className="">
                {service.images.map((image, index) => (
                <CarouselItem key={index}>
                    <div className="w-[40rem] h-[30rem] aspect-square relative">
                    <Image 
                        src={image} 
                        alt={`Service Image ${index + 1}`} 
                        className='object-cover rounded w-full' 
                        fill
                    />
                    </div>
                </CarouselItem>
                ))}
            </CarouselContent>
            <div className="absolute bottom-8 right-28 flex items-center gap-2">
                <CarouselPrevious />
                <CarouselNext />
            </div>
            </Carousel>
            <div className='flex gap-4 justify-start'>
            {service.images.map((image, index) => (
                <div 
                key={index} 
                className={`rounded ${currentImgIndex === index ? 'ring ring-amber-500' : ''}`} 
                onClick={() => {
                    api?.scrollTo(index);
                    setCurrentImageIndex(index);
                }}
                >
                <Image 
                    src={image} 
                    alt={`Service Image ${index + 1}`} 
                    className='object-cover aspect-square rounded' 
                    width={80} 
                    height={80} 
                />
                </div>
            ))}
            </div>
        </div>
    )
}
