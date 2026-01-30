import { Button } from "@/components/ui/button"
import { ArrowRight, Calendar } from "lucide-react"
import Link from "next/link"

export function CTASection() {
  return (
    <section
      className="py-12 px-4 md:py-16 md:px-6 lg:py-20 lg:px-8 fade-in-section"
      style={{
        width: "100%",
        background: "transparent",
        position: "relative",
        margin: "0 auto",
        textRendering: "optimizeLegibility",
        WebkitFontSmoothing: "antialiased",
        boxSizing: "border-box",
        overflow: "hidden",
        transform: "translateZ(0)",
        willChange: "transform",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          top: 0,
          left: "50%",
          transform: "translateX(-50%)",
          backgroundImage: "url('/img/bgpattern.svg')",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center center",
          backgroundSize: "contain",
          opacity: 1,
          zIndex: 0,
          pointerEvents: "none",
          width: "100%",
          maxWidth: "1356px",
          height: "100%",
        }}
        aria-hidden="true"
      />
      <div
        className="px-4 py-8 md:px-6 md:py-10 lg:px-8 lg:py-12"
        style={{
          width: "100%",
          maxWidth: "1232px",
          margin: "0 auto",
          position: "relative",
          zIndex: 1,
        }}
      >
        <div className="max-w-3xl mx-auto text-center text-foreground space-y-6">
          <div className="space-y-2">
            <h2
              className="text-[24px] leading-[33.6px] tracking-[-0.48px] md:text-[28px] md:leading-[39.2px] md:tracking-[-0.56px] lg:text-[32px] lg:leading-[44.8px] lg:tracking-[-0.64px] fade-in-blur"
              style={{
                fontFamily: "Poppins, sans-serif",
                fontWeight: 600,
                fontStyle: "normal",
                textAlign: "center",
                background: "linear-gradient(to left, #0082c0 0%, #3b60af 100%)",
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                WebkitTextFillColor: "transparent",
                color: "transparent",
                willChange: "opacity, transform, filter",
              }}
            >
              Stop Piloting. Start Scaling.
            </h2>
            <p
              className="text-sm leading-[21px] md:text-[15px] md:leading-[22.5px] lg:text-base lg:leading-6 text-balance fade-in-section"
              style={{
                fontFamily: "Poppins, sans-serif",
                fontWeight: 400,
                fontStyle: "normal",
                letterSpacing: "0%",
                textAlign: "center",
                color: "#6b7280",
                willChange: "opacity, transform",
              }}
            >
              Let&apos;s identify your first high-value use cases — we&apos;ll deploy a production-ready agent in weeks.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 scale-in">
            <Button asChild size="lg" variant="default" className="gap-2">
              <Link href="/contact">
                <Calendar className="h-4 w-4" />
                Schedule a Discussion
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="gap-2 border-border text-foreground hover:bg-muted">
              <a href="https://tngrm.ai" target="_blank" rel="noopener noreferrer">
                View Tangram Store
                <ArrowRight className="h-4 w-4" />
              </a>
            </Button>
          </div>
          <div className="pt-6 border-t border-border space-y-3 fade-in-section">
            <p className="text-base md:text-lg font-medium" style={{ color: "#374151" }}>
              Speed is Crayon Data&apos;s superpower
            </p>
            <div
              className="flex flex-wrap items-center justify-center gap-4 md:gap-5 text-sm leading-[21px] md:text-[15px] md:leading-[22.5px] lg:text-base lg:leading-6"
              style={{
                fontFamily: "Poppins, sans-serif",
                fontWeight: 400,
                fontStyle: "normal",
                letterSpacing: "0%",
                color: "#091917",
              }}
            >
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: "#04ab8b" }} />
                <span>100s of ready ideas</span>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className="h-2 w-2 shrink-0"
                  style={{ backgroundColor: "#394fa1", clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)" }}
                />
                <span>Demos in days</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 shrink-0" style={{ backgroundColor: "#ffc334" }} />
                <span>Prototypes in weeks</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
