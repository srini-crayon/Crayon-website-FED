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
import { SlideIllustration as SlideIllustrationComponent } from "@/components/slide-illustration"

const slides = [
  {
    tag: "Simplify AI Success",
    headline: ["Accelerate Your", "Journey to AI Success", ""],
    highlightLine: 1,
    gradientColors: {
      from: "oklch(0.5 0.35 260)",
      to: "oklch(0.65 0.35 175)",
    },
    glowColors: {
      primary: "oklch(0.55 0.2 260/0.15)",
      secondary: "oklch(0.65 0.2 175/0.12)",
    },
    description:
      "AI is easy to demo. It's hard to run. Crayon Data simplifies and accelerates AI adoption, turning pilots and POCs into secure, production-grade systems that run responsibly and at scale.",
    primaryCta: { label: "Explore Tangram", href: "/tangram-ai" },
    secondaryCta: { label: "See How Catalyst Works", href: "/catalyst" },
  },
  {
    tag: "We help you",
    headline: ["Discover. Deploy.", "Govern. Scale.", ""],
    highlightLine: 0,
    gradientColors: {
      from: "oklch(0.6 0.35 330)",
      to: "oklch(0.5 0.35 260)",
    },
    glowColors: {
      primary: "oklch(0.6 0.25 330/0.15)",
      secondary: "oklch(0.5 0.25 260/0.12)",
    },
    description:
      "We help you: discover real business use cases; deploy AI inside messy enterprise stacks; govern and scale intelligently; move from conversation to capability. AI shouldn't sit in slide decks. It should run inside your enterprise.",
    primaryCta: { label: "Explore Tangram", href: "/tangram-ai" },
    secondaryCta: { label: "See How Catalyst Works", href: "/catalyst" },
  },
  {
    tag: "Enterprise GenAI Partner",
    headline: ["Strategy to Scale.", "Executed in Enterprise GenAI", ""],
    highlightLine: 0,
    gradientColors: {
      from: "oklch(0.7 0.35 75)",
      to: "oklch(0.6 0.35 175)",
    },
    glowColors: {
      primary: "oklch(0.7 0.2 75/0.15)",
      secondary: "oklch(0.6 0.2 45/0.12)",
    },
    description:
      "Crayon Data helps enterprises move from GenAI pilots to production. With AI Catalyst and the Tangram.ai platform, we deliver results fast, real, and measurable.",
    primaryCta: { label: "Explore Tangram", href: "/tangram-ai" },
    secondaryCta: { label: "See Catalyst in Action", href: "/catalyst" },
  },
  {
    tag: "7X Impact",
    headline: ["7X Accelerate", "Your Enterprise", ""],
    highlightLine: 0,
    gradientColors: {
      from: "oklch(0.6 0.35 175)",
      to: "oklch(0.7 0.35 25)",
    },
    glowColors: {
      primary: "oklch(0.6 0.25 175/0.15)",
      secondary: "oklch(0.7 0.2 25/0.12)",
    },
    description:
      "Productivity. Experience. Data. Speed. All Transformed. Agentic AI workflows designed to eliminate drag and multiply performance — across strategy, operations, and product execution.",
    primaryCta: { label: "See in Action", href: "#clients" },
  },
]

// Only show the first slide ("Accelerate Your Journey to AI Success"); set to slides to show all
const visibleSlides = slides.slice(0, 1)

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
    <section ref={heroSectionRef} className="relative py-12 md:py-16 overflow-hidden w-full">
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
      
      {/* Colorful background gradients - changes per slide */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute top-10 right-0 w-[500px] h-[500px] rounded-full blur-[100px] transition-all duration-1000 ease-out"
          style={{ backgroundColor: slides[current]?.glowColors.primary }}
        />
        <div
          className="absolute top-40 right-40 w-[300px] h-[300px] rounded-full blur-[80px] transition-all duration-1000 ease-out"
          style={{ backgroundColor: slides[current]?.glowColors.secondary }}
        />
        <div
          className="absolute -bottom-20 -left-20 w-[400px] h-[400px] rounded-full blur-[100px] transition-all duration-1000 ease-out"
          style={{ backgroundColor: slides[current]?.glowColors.secondary, opacity: 0.8 }}
        />
        <div
          className="absolute bottom-40 left-1/3 w-[250px] h-[250px] rounded-full blur-[80px] transition-all duration-1000 ease-out"
          style={{ backgroundColor: slides[current]?.glowColors.primary, opacity: 0.6 }}
        />
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
              delay: 10000,
              stopOnInteraction: false,
              stopOnMouseEnter: true,
            }),
          ]}
          className="w-full"
        >
          <CarouselContent className="-ml-0">
            {visibleSlides.map((slide, index) => (
              <CarouselItem key={index} className="pl-0 w-full">
                <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-start max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  {/* Left - Content */}
                  <div className={cn("max-w-xl", index === 0 && "lg:max-w-2xl")}>
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
                      <a
                        href={slide.primaryCta.href}
                        ref={(el) => {
                          if (el) buttonRefs.current[index] = el as unknown as HTMLButtonElement
                        }}
                        className="border-gradient animate-button-glow-gradient relative text-white rounded-[4px] px-8 py-3 h-12 flex items-center justify-center gap-2 font-medium transition-all hover:opacity-90"
                        style={{
                          "--gradient-angle": "0deg",
                          boxShadow: "0 0 20px rgba(249, 115, 22, 0.4), 0 0 40px rgba(236, 72, 153, 0.2), 0 0 60px rgba(139, 92, 246, 0.15)",
                        } as React.CSSProperties & { "--gradient-angle"?: string }}
                      >
                        <span className="relative z-10">{slide.primaryCta.label}</span>
                        <ArrowRight className="relative z-10 w-4 h-4" />
                      </a>
                      {"secondaryCta" in slide && slide.secondaryCta && (
                        <a
                          href={slide.secondaryCta.href}
                          className="border border-border hover:bg-muted/50 rounded-[4px] px-8 py-3 h-12 flex items-center justify-center gap-2 font-medium text-foreground transition-all"
                        >
                          <span>{slide.secondaryCta.label}</span>
                          <ArrowRight className="w-4 h-4" />
                        </a>
                      )}
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

        {/* Navigation Controls - hidden when only first slide is shown */}
        {visibleSlides.length > 1 && (
          <div className="flex items-center justify-end mt-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-4">
              <span className="text-sm font-mono text-muted-foreground">
                [{current + 1}/{visibleSlides.length}]
              </span>
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
        )}

      </div>
    </section>
  )
}
