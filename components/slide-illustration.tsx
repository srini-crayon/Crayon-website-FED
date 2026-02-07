"use client"

import { useEffect, useState } from "react"
import Image from "next/image"

const slideData = [
  { src: "/img/hero-ai-transformation.png", alt: "AI Transformation" },
  { src: "/img/hero-tangram-ai.png", alt: "Tangram AI Platform" },
  { src: "/img/hero-strategy-scale.png", alt: "Strategy to Scale" },
  { src: "/img/hero-7x-accelerate.png", alt: "7X Accelerate Your Enterprise" },
]

export function SlideIllustration({ slideIndex, isActive }: { slideIndex: number; isActive: boolean }) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    if (isActive) {
      setMounted(true)
    } else {
      setMounted(false)
    }
  }, [isActive])

  const slide = slideData[slideIndex]
  if (!slide) return null

  return (
    <div 
      className="relative w-[520px] h-[520px] flex items-center justify-center"
      style={{
        opacity: mounted ? 1 : 0,
        transform: mounted ? 'scale(1)' : 'scale(0.95)',
        transitionProperty: 'opacity, transform',
        transitionDuration: '0.6s',
        transitionTimingFunction: 'ease-out',
        transitionDelay: '0.2s'
      }}
    >
      <Image
        src={slide.src}
        alt={slide.alt}
        width={520}
        height={520}
        className="object-contain"
        priority
      />
    </div>
  )
}
