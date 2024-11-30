'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'

import { Progress } from '@/components/ui/progress'

export default function Loading() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prevProgress) => {
        if (prevProgress >= 100) {
          clearInterval(timer)
          return 100
        }
        return prevProgress + 20
      })
    }, 500)

    return () => clearInterval(timer)
  }, [])

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background">
      <div className="relative w-32 h-32 mb-8">
        <Image
          src="/Unihive.svg"
          alt="Unihive Logo"
          width={128}
          height={128}
          className="z-10"
        />
        <motion.div
          className="absolute top-0 left-0 w-full h-full border-4 border-primary rounded-full border-t-transparent"
          animate={{ rotate: 360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
        />
      </div>
      <Progress value={progress} className="w-64 mb-4" />
      <p className="text-foreground">{progress}% Loading...</p>
    </div>
  )
}