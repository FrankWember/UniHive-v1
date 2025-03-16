"use client"
import { useIsMobile } from '@/hooks/use-mobile'
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, type CarouselApi } from "@/components/ui/carousel"
import Image from 'next/image'
import React, { useState } from 'react'
import { cn } from '@/lib/utils'

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
        <div className="relative flex flex-col gap-2">
            <Carousel setApi={setApi} className="relative w-full">
                <CarouselContent>
                    {service.images.map((image, index) => (
                    <CarouselItem key={index}>
                        <div className="relative w-full h-[55vh]">
                        <Image
                            src={image}
                            alt={`${service.name} - Image ${index + 1}`}
                            fill
                            className="object-cover"
                        />
                        </div>
                    </CarouselItem>
                    ))}
                </CarouselContent>
                    <CarouselPrevious className='absolute top-1/2 left-6 z-20 border' data-carousel-button />
                    <CarouselNext className='absolute top-1/2 right-6 z-20 border' data-carousel-button />
            </Carousel>
        </div>
    )

return (
  <div className="grid grid-cols-4 grid-rows-2 gap-2 w-full h-[28rem] overflow-hidden">
    {service.images.map((image, index) => {
      let roundedClass = ""

      // Big main image — apply top-left and bottom-left rounding
      if (index === 0) {
        roundedClass = "rounded-l-lg"
      }

      // Top-right corner image (top-right of 2x2)
      if (index === 2) {
        roundedClass = "rounded-tr-lg"
      }

      // Bottom-right corner image (bottom-right of 2x2)
      if (index === 4) {
        roundedClass = "rounded-br-lg"
      }

      return (
        <div
          key={index}
          className={cn(
            'relative w-full h-full',
            index === 0 && 'col-span-2 row-span-2'
          )}
        >
          <Image
            src={image}
            alt={`${service.name} - Image ${index + 1}`}
            fill
            className={cn("object-cover", roundedClass)}
          />
        </div>
      )
    })}
  </div>
)

}
