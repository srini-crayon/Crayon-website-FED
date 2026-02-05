"use client"

import { useCallback, useEffect, useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel"
import Autoplay from "embla-carousel-autoplay"
import { cn } from "@/lib/utils"
import { SlideIllustration as SlideIllustrationComponent } from "@/components/slide-illustration" // Import SlideIllustration component

const slides = [
  {
    tag: "Enterprise AI Platform",
    headline: ["From AI ambition", "to AI running", "in production."],
    highlightLine: 1,
    gradientColors: {
      from: "oklch(0.5 0.35 260)",
      to: "oklch(0.65 0.35 175)",
    },
    description:
      "Crayon Data helps enterprises design, deploy, and scale AI across real-world systems — where data is messy, regulations matter, and impact is measured in outcomes.",
    primaryCta: { label: "Explore Tangram", href: "#tangram" },
    secondaryCta: { label: "See How Catalyst Scales AI", href: "#catalyst" },
  },
  {
    tag: "Tangram AI Platform",
    headline: ["Build intelligent", "AI agents that", "understand context."],
    highlightLine: 1,
    gradientColors: {
      from: "oklch(0.6 0.35 330)",
      to: "oklch(0.5 0.35 260)",
    },
    description:
      "Design and deploy AI agents with deep contextual understanding. Tangram combines knowledge graphs, multi-modal data, and enterprise-grade security.",
    primaryCta: { label: "Discover Tangram", href: "#tangram" },
    secondaryCta: { label: "View Case Studies", href: "#clients" },
  },
  {
    tag: "Catalyst Execution Engine",
    headline: ["Scale AI from", "pilot to production", "with confidence."],
    highlightLine: 1,
    gradientColors: {
      from: "oklch(0.7 0.35 75)",
      to: "oklch(0.6 0.35 175)",
    },
    description:
      "Move beyond AI experiments. Catalyst provides the infrastructure to deploy, monitor, and scale AI systems across your entire organization.",
    primaryCta: { label: "Explore Catalyst", href: "#catalyst" },
    secondaryCta: { label: "Talk to Our Team", href: "#contact" },
  },
  {
    tag: "Proven at Scale",
    headline: ["117M+ users.", "13B+ transactions.", "Real impact."],
    highlightLine: 2,
    gradientColors: {
      from: "oklch(0.6 0.35 175)",
      to: "oklch(0.7 0.35 25)",
    },
    description:
      "Trusted by leading banks and enterprises worldwide. Our AI solutions drive measurable business outcomes at unprecedented scale.",
    primaryCta: { label: "See Our Impact", href: "#clients" },
    secondaryCta: { label: "Get Started", href: "#contact" },
  },
]

export function HeroSection() {
  const [api, setApi] = useState<CarouselApi>()
  const [current, setCurrent] = useState(0)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const heroSectionRef = useRef<HTMLElement>(null)
  const buttonRefs = useRef<(HTMLButtonElement | null)[]>([])

  useEffect(() => {
    if (!api) return

    setCurrent(api.selectedScrollSnap())

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap())
    })
  }, [api])

  // Track mouse position for dot pattern animation
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!heroSectionRef.current) return
      
      const rect = heroSectionRef.current.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      
      setMousePosition({ x, y })
    }

    const section = heroSectionRef.current
    if (section) {
      section.addEventListener("mousemove", handleMouseMove, { passive: true })
      return () => {
        section.removeEventListener("mousemove", handleMouseMove)
      }
    }
  }, [])

  // Rotate gradient animation for all buttons
  useEffect(() => {
    const elements = buttonRefs.current.filter(Boolean) as HTMLButtonElement[]
    if (!elements.length) return

    let angle = 0
    const rotateGradient = () => {
      angle = (angle + 1) % 360
      elements.forEach((el) => {
        if (el) el.style.setProperty("--gradient-angle", `${angle}deg`)
      })
      requestAnimationFrame(rotateGradient)
    }

    rotateGradient()
  }, [])

  const scrollTo = useCallback(
    (index: number) => {
      api?.scrollTo(index)
    },
    [api]
  )

  const scrollPrev = useCallback(() => {
    api?.scrollPrev()
  }, [api])

  const scrollNext = useCallback(() => {
    api?.scrollNext()
  }, [api])

  return (
    <section ref={heroSectionRef} className="relative pt-24 pb-16 md:pt-32 md:pb-24 overflow-hidden w-full">
      {/* Cursor-based dot pattern with radial gradient reveal */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          zIndex: 1,
          overflow: 'hidden',
        }}
      >
        {/* Dot pattern visible only on hover near cursor */}
        <div
          className="opacity-20 dark:opacity-15"
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `radial-gradient(circle 4px, currentColor 2px, transparent 2px)`,
            backgroundSize: '24px 24px',
            backgroundPosition: '0 0',
            backgroundRepeat: 'repeat',
            color: 'currentColor',
            maskImage: `radial-gradient(circle 200px at ${mousePosition.x}px ${mousePosition.y}px, black 0%, rgba(0,0,0,0.6) 40%, transparent 70%)`,
            WebkitMaskImage: `radial-gradient(circle 200px at ${mousePosition.x}px ${mousePosition.y}px, black 0%, rgba(0,0,0,0.6) 40%, transparent 70%)`,
            transition: 'mask-image 0.1s ease-out, -webkit-mask-image 0.1s ease-out',
            willChange: 'mask-image',
          }}
        />
      </div>

      {/* Grid pattern background */}
      <div 
        className="absolute inset-0 pointer-events-none z-0 opacity-[0.03] dark:opacity-[0.05]"
        style={{
          backgroundImage: `
            linear-gradient(to right, currentColor 1px, transparent 1px),
            linear-gradient(to bottom, currentColor 1px, transparent 1px)
          `,
          backgroundSize: '24px 24px',
          color: 'currentColor'
        }}
      />
      
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-background/50 dark:bg-background/30 pointer-events-none z-0" />
      
      {/* Colorful background gradients */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-10 right-0 w-[500px] h-[500px] bg-[oklch(0.65_0.2_175/0.15)] rounded-full blur-[100px]" />
        <div className="absolute top-40 right-40 w-[300px] h-[300px] bg-[oklch(0.55_0.2_260/0.12)] rounded-full blur-[80px]" />
        <div className="absolute -bottom-20 -left-20 w-[400px] h-[400px] bg-[oklch(0.65_0.2_330/0.1)] rounded-full blur-[100px]" />
        <div className="absolute bottom-40 left-1/3 w-[250px] h-[250px] bg-[oklch(0.7_0.18_75/0.08)] rounded-full blur-[80px]" />
      </div>

      <div className="relative w-full z-10">
        <Carousel
          setApi={setApi}
          opts={{
            align: "start",
            loop: true,
          }}
          plugins={[
            Autoplay({
              delay: 5000,
              stopOnInteraction: false,
              stopOnMouseEnter: true,
            }),
          ]}
          className="w-full"
        >
          <CarouselContent className="-ml-0">
            {slides.map((slide, index) => (
              <CarouselItem key={index} className="pl-0 w-full">
                <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 md:mt-12">
                  {/* Left - Content */}
                  <div className="max-w-xl">
                    <div className="inline-flex items-center gap-2 mb-6">
                      <span className="w-8 h-[1px] bg-foreground/40 dark:bg-foreground/60" />
                      <p className="text-foreground/90 dark:text-foreground font-medium tracking-wide text-xs uppercase">
                        {slide.tag}
                      </p>
                    </div>
                    <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-5xl xl:text-6xl font-light tracking-tight leading-[1.1]">
                      {slide.headline.map((line, lineIndex) => (
                        <span key={lineIndex}>
                          {lineIndex === slide.highlightLine ? (
                            <span
                              className="bg-gradient-to-r bg-clip-text text-transparent"
                              style={{
                                backgroundImage: `linear-gradient(to right, ${slide.gradientColors.from}, ${slide.gradientColors.to})`,
                              }}
                            >
                              {line}
                            </span>
                          ) : (
                            <span className="font-medium text-foreground">
                              {line}
                            </span>
                          )}
                          {lineIndex < slide.headline.length - 1 && <br />}
                        </span>
                      ))}
                    </h1>
                    <p className="mt-6 text-base md:text-lg text-muted-foreground max-w-lg leading-relaxed">
                      {slide.description}
                    </p>

                    <div className="mt-8 flex flex-col sm:flex-row gap-3 items-center">
                      <button
                        ref={(el) => {
                          buttonRefs.current[index] = el
                        }}
                        className="border-gradient animate-button-glow-gradient relative text-white rounded-[4px] px-8 py-3 h-12 flex items-center justify-center gap-2 font-medium transition-all hover:opacity-90"
                        style={{
                          "--gradient-angle": "0deg",
                          boxShadow: "0 0 20px rgba(249, 115, 22, 0.4), 0 0 40px rgba(236, 72, 153, 0.2), 0 0 60px rgba(139, 92, 246, 0.15)",
                        } as React.CSSProperties & { "--gradient-angle"?: string }}
                      >
                        <span className="relative z-10">{slide.primaryCta.label}</span>
                        <ArrowRight className="relative z-10 w-4 h-4" />
                      </button>
                      <Button
                        size="lg"
                        variant="outline"
                        className="border-foreground/30 dark:border-foreground/40 text-foreground hover:bg-muted/50 hover:border-foreground/40 px-8 bg-transparent dark:bg-transparent h-12"
                      >
                        {slide.secondaryCta.label}
                      </Button>
                    </div>
                  </div>

                  {/* Right - Animated Illustration */}
                  <div className="hidden lg:flex items-center justify-center">
                    <SlideIllustrationComponent slideIndex={index} isActive={current === index} />
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>

        {/* Navigation Controls */}
        <div className="flex items-center justify-end mt-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            {/* Carousel indicator */}
            <span className="text-sm font-mono text-muted-foreground">
              [{current + 1}/{slides.length}]
            </span>
            {/* Arrow navigation */}
            <div className="flex items-center gap-2">
              <button
                onClick={scrollPrev}
                className="flex items-center justify-center w-10 h-10 border border-border hover:bg-muted hover:border-accent/30 transition-all"
                aria-label="Previous slide"
              >
                <ChevronLeft className="w-4 h-4 text-foreground" />
              </button>
              <button
                onClick={scrollNext}
                className="flex items-center justify-center w-10 h-10 border border-border hover:bg-muted hover:border-accent/30 transition-all"
                aria-label="Next slide"
              >
                <ChevronRight className="w-4 h-4 text-foreground" />
              </button>
            </div>
          </div>
        </div>

      </div>
    </section>
  )
}
