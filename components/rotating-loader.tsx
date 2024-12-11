'use client'

import React from 'react'
import { motion } from 'framer-motion'

interface RotatingLoaderProps {
  size?: number
  borderWidth?: number
  color?: string
  secondaryColor?: string
  className?: string
}

export default function RotatingLoader({
  size = 48,
  borderWidth = 4,
  color = 'primary',
  secondaryColor = 'secondary',
  className = '',
}: RotatingLoaderProps) {
  return (
    <div className={`flex items-center justify-center ${className}`} style={{ width: size, height: size }}>
      <motion.div
        className={`rounded-full border-${borderWidth} border-${secondaryColor}`}
        style={{
          width: '100%',
          height: '100%',
          borderTopColor: `var(--${color})`,
          borderRightColor: `var(--${color})`,
        }}
        animate={{ rotate: 360 }}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: [0.5, 0.01, 0.5, 0.99], // Custom spring-like easing
        }}
      />
    </div>
  )
}