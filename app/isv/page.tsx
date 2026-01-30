"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "../../components/ui/button"
import { Card } from "../../components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../../components/ui/accordion"
import { Input } from "../../components/ui/input"
import Image from "next/image"
import veehiveLogo from "../../assets/image-470636c9-6efb-42e4-8eb7-65103b1c7a7d.png"
import veehivePortrait from "../../assets/image-9fe0672b-99a3-4e00-8069-a8377de93483.png"
import leftCardPortrait from "../../assets/image-95aa0dfb-52a9-414a-9056-bf42ddc01c6d.png"
import rightCardPortrait from "../../assets/image-e8bc3a81-91bd-425f-9ff9-c98c08858e28.png"
import { useModal } from "../../hooks/use-modal"
import { useAuthStore } from "../../lib/store/auth.store"
import { useRouter } from "next/navigation"
import { ArrowRight, ArrowLeft, Target, Globe, TrendingUp, ChevronLeft, ChevronRight, Plus, X, Play } from "lucide-react"

export default function ISVPage() {
  const { openModal } = useModal()
  const { user, isAuthenticated } = useAuthStore()
  const router = useRouter()
  const [currentTestimonial, setCurrentTestimonial] = useState(0)
  const [progress, setProgress] = useState(0)
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null)
  const [faqFilter, setFaqFilter] = useState<string>("General")
  const [isTransitioning, setIsTransitioning] = useState(true)
  const totalTestimonials = 3 // Update this when you add more testimonials

  // Hover states for feature cards
  const [hoveredCard1, setHoveredCard1] = useState(false)
  const [hoveredCard2, setHoveredCard2] = useState(false)
  const [hoveredCard3, setHoveredCard3] = useState(false)

  // Mouse position state for radial hover effect (in pixels relative to hero section)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const heroSectionRef = useRef<HTMLElement>(null)

  // Get the actual testimonial index (0-2) for display purposes
  const actualTestimonialIndex = currentTestimonial >= totalTestimonials
    ? currentTestimonial - totalTestimonials
    : currentTestimonial

  // Reset progress when testimonial actually changes
  useEffect(() => {
    setProgress(0)
  }, [actualTestimonialIndex])

  // Auto-scroll functionality with progress timer
  useEffect(() => {
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          return 0
        }
        return prev + 2 // Increment by 2% every 100ms (5 seconds total)
      })
    }, 100) // Update every 100ms for smooth animation

    const slideInterval = setInterval(() => {
      setIsTransitioning(true)
      setCurrentTestimonial((prev) => {
        const next = prev + 1
        // If we've reached the duplicate set, jump back to the start seamlessly
        if (next >= totalTestimonials) {
          setTimeout(() => {
            setIsTransitioning(false)
            setCurrentTestimonial(0)
            setTimeout(() => {
              setIsTransitioning(true)
            }, 10)
          }, 600)
          return totalTestimonials
        }
        return next
      })
    }, 5000) // Change slide every 5 seconds

    return () => {
      clearInterval(progressInterval)
      clearInterval(slideInterval)
    }
  }, [totalTestimonials])

  const goToPrevious = () => {
    setIsTransitioning(true)
    setProgress(0) // Reset progress when manually navigating
    setCurrentTestimonial((prev) => {
      if (prev === 0) {
        // Jump to the end of duplicate set for seamless loop
        setTimeout(() => {
          setIsTransitioning(false)
          setCurrentTestimonial(totalTestimonials)
          setTimeout(() => {
            setIsTransitioning(true)
          }, 10)
        }, 600)
        return totalTestimonials * 2
      }
      return prev - 1
    })
  }

  const goToNext = () => {
    setIsTransitioning(true)
    setProgress(0) // Reset progress when manually navigating
    setCurrentTestimonial((prev) => {
      const next = prev + 1
      // If we've reached the duplicate set, jump back to the start seamlessly
      if (next >= totalTestimonials * 2) {
        setTimeout(() => {
          setIsTransitioning(false)
          setCurrentTestimonial(0)
          setTimeout(() => {
            setIsTransitioning(true)
          }, 10)
        }, 600)
        return totalTestimonials * 2
      }
      return next
    })
  }

  useEffect(() => {
    setExpandedFaq(null)
  }, [faqFilter])

  useEffect(() => {
    setFaqFilter("General")
    setExpandedFaq(null)
  }, [])

  const faqEntries = [
    // General
    { section: "General", q: "Who is this program for?", a: "ISVs and AI teams building agent-based or AI-powered solutions." },
    { section: "General", q: "What solutions are supported?", a: "Enterprise and industry-specific AI agents and applications." },
    { section: "General", q: "Do I need existing customers?", a: "No. Early-stage and established ISVs are welcome." },
    { section: "General", q: "How does the marketplace work?", a: "Approved solutions are listed for customer discovery and deployment." },
    { section: "General", q: "Why Tangram.ai vs other marketplaces?", a: "Active co-selling, GTM alignment, and hands-on partner support." },
    // Go-To-Market & Sales
    { section: "Go-To-Market & Sales", q: "How does co-selling work?", a: "Tangram.ai collaborates on qualified deals to accelerate sales." },
    { section: "Go-To-Market & Sales", q: "Can I still sell independently?", a: "Yes. You keep full sales and marketing freedom." },
    { section: "Go-To-Market & Sales", q: "Is the program global?", a: "Yes. Partners can reach customers worldwide." },
    // Technical
    { section: "Technical", q: "Is Tangram.ai framework-agnostic?", a: "Yes. It supports modern AI and agent architectures." },
    { section: "Technical", q: "How do I integrate?", a: "Via documented APIs and platform tooling." },
    { section: "Technical", q: "Can I deploy in my own infrastructure?", a: "Yes. Flexible deployment models are supported." },
    { section: "Technical", q: "Is multi-tenancy supported?", a: "Yes. Built for enterprise-scale multi-tenant use." },
    { section: "Technical", q: "How are updates handled?", a: "ISVs control releases and versioning." },
    { section: "Technical", q: "Can I integrate third-party systems?", a: "Yes. APIs and connectors enable integrations." },
    { section: "Technical", q: "Are monitoring tools available?", a: "Yes. Usage, logging, and performance insights are provided." },
    { section: "Technical", q: "Do you provide developer documentation?", a: "Yes. Documentation and sandbox access are included." },
    { section: "Technical", q: "Who owns the IP?", a: "ISVs retain full ownership of their IP." },
    // Security & Compliance
    { section: "Security & Compliance", q: "Is Tangram.ai enterprise-grade secure?", a: "Yes. Built with enterprise security best practices." },
    { section: "Security & Compliance", q: "Do you support SOC 2?", a: "Tangram.ai supports SOC 2–aligned security and controls." },
    { section: "Security & Compliance", q: "Is GDPR supported?", a: "Yes. Data handling aligns with GDPR requirements." },
    { section: "Security & Compliance", q: "How is customer data isolated?", a: "Data is logically isolated per customer." },
    { section: "Security & Compliance", q: "Do you support data protection agreements?", a: "Yes. DPAs are supported as part of enterprise contracts." },
    { section: "Security & Compliance", q: "Are audits and compliance reviews supported?", a: "Yes. Tangram.ai works with partners on audit and governance needs." },
    // Commercial & Legal
    { section: "Commercial & Legal", q: "What’s the commercial model?", a: "Marketplace revenue share, direct sales, or co-sell models." },
    { section: "Commercial & Legal", q: "Who contracts with the customer?", a: "Flexible models: ISV, Tangram.ai, or joint contracts." },
    { section: "Commercial & Legal", q: "Who sets pricing?", a: "ISVs set pricing with optional GTM guidance." },
    { section: "Commercial & Legal", q: "Are MSAs and SLAs supported?", a: "Yes. Enterprise agreements are supported." },
    { section: "Commercial & Legal", q: "Is there an onboarding review?", a: "Yes. Technical, security, and commercial readiness is reviewed." },
    { section: "Commercial & Legal", q: "Can I exit the program?", a: "Yes. Clear offboarding and transition terms apply." },
    { section: "Commercial & Legal", q: "Do I get a dedicated partner contact?", a: "Yes. One point of contact for tech, sales, and GTM." },
  ]
  // Rotate gradient animation for button
  useEffect(() => {
    const element = document.querySelector(".border-gradient") as HTMLElement;
    if (!element) return;

    let angle = 0;
    let animationFrameId: number;
    const rotateGradient = () => {
      angle = (angle + 1) % 360;
      element.style.setProperty("--gradient-angle", `${angle}deg`);
      animationFrameId = requestAnimationFrame(rotateGradient);
    };

    rotateGradient();

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [])

  // Scroll animations with IntersectionObserver - Optimized for performance
  useEffect(() => {
    // Use requestIdleCallback for better performance, fallback to setTimeout
    const scheduleObservation = (callback: () => void) => {
      if ('requestIdleCallback' in window) {
        requestIdleCallback(callback, { timeout: 200 });
      } else {
        setTimeout(callback, 100);
      }
    };

    const observerOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px", // Trigger earlier for smoother experience
    };

    const observer = new IntersectionObserver((entries) => {
      // Use requestAnimationFrame for smooth animations
      requestAnimationFrame(() => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Handle different animation types
            if (entry.target.classList.contains("fade-in-section")) {
              entry.target.classList.add("fade-in-visible");
            } else if (entry.target.classList.contains("slide-in-left")) {
              entry.target.classList.add("slide-in-visible");
            } else if (entry.target.classList.contains("slide-in-right")) {
              entry.target.classList.add("slide-in-visible");
            } else if (entry.target.classList.contains("scale-in")) {
              entry.target.classList.add("scale-in-visible");
            } else if (entry.target.classList.contains("fade-in-blur")) {
              entry.target.classList.add("fade-in-blur-visible");
            } else if (entry.target.classList.contains("stagger-item")) {
              entry.target.classList.add("stagger-visible");
            }
            // Unobserve after animation to improve performance
            observer.unobserve(entry.target);
          }
        });
      });
    }, observerOptions);

    // Function to observe all animated elements
    const observeElements = () => {
      const animatedElements = document.querySelectorAll(
        ".fade-in-section, .slide-in-left, .slide-in-right, .scale-in, .fade-in-blur, .stagger-item"
      );
      animatedElements.forEach((el) => observer.observe(el));
    };

    // Observe elements after DOM is ready
    scheduleObservation(observeElements);

    return () => {
      const animatedElements = document.querySelectorAll(
        ".fade-in-section, .slide-in-left, .slide-in-right, .scale-in, .fade-in-blur, .stagger-item"
      );
      animatedElements.forEach((el) => observer.unobserve(el));
      observer.disconnect();
    };
  }, [])

  // Mouse tracking for radial hover background effect in hero section
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (heroSectionRef.current) {
        const rect = heroSectionRef.current.getBoundingClientRect();
        // Use pixel coordinates relative to hero section
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // Use requestAnimationFrame for smooth updates
        requestAnimationFrame(() => {
          setMousePosition({ x, y });
        });
      }
    };

    const heroSection = heroSectionRef.current;
    if (heroSection) {
      heroSection.addEventListener('mousemove', handleMouseMove, { passive: true });
      return () => {
        heroSection.removeEventListener('mousemove', handleMouseMove);
      };
    }
  }, []);

  const handleOnboardAgent = () => {
    if (isAuthenticated && user?.role === 'isv') {
      // User is logged in as ISV, redirect to onboard page
      router.push('/onboard')
    } else {
      // User is not logged in as ISV, show ISV login modal
      openModal("auth", { mode: "login", role: "isv" })
    }
  }

  return (
    <div className="min-h-screen" style={{ scrollBehavior: "smooth" }}>
      {/* Content wrapper */}
      <div style={{ position: 'relative', zIndex: 1 }}>
        {/* Hero Section with Gradient */}
        <section ref={heroSectionRef} className="relative overflow-hidden min-h-[90vh]" style={{ transform: "translateZ(0)", willChange: "scroll-position", contain: "layout style paint" }}>
          {/* Cursor-based dot pattern with radial gradient reveal - Hero Section Only */}
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              inset: 0,
              pointerEvents: "none",
              zIndex: 5,
              overflow: 'hidden',
            }}
          >
            {/* Dot pattern visible only on hover near cursor */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                backgroundImage: `radial-gradient(circle 4px, rgba(0, 0, 0, 0.4) 2px, transparent 2px)`,
                backgroundSize: '24px 24px',
                backgroundPosition: '0 0',
                backgroundRepeat: 'repeat',
                maskImage: `radial-gradient(circle 200px at ${mousePosition.x}px ${mousePosition.y}px, black 0%, rgba(0,0,0,0.6) 40%, transparent 70%)`,
                WebkitMaskImage: `radial-gradient(circle 200px at ${mousePosition.x}px ${mousePosition.y}px, black 0%, rgba(0,0,0,0.6) 40%, transparent 70%)`,
                transition: 'mask-image 0.1s ease-out, -webkit-mask-image 0.1s ease-out',
                willChange: 'mask-image',
              }}
            />
          </div>

          {/* Top radial gradient banner */}
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              width: "100%",
              height: "100%",
              top: 0,
              left: 0,
              background: "radial-gradient(100% 100% at 50% 0%, #E5E5FF 0%, #FFFFFF 100%)",
              opacity: 1,
              pointerEvents: "none",
              zIndex: -1,
            }}
          />
          <div className="w-full px-8 md:px-12 lg:px-16 py-12 md:py-20 lg:py-24 relative text-center">
            {/* Main Title */}
            <h1
              className="mb-4 text-center fade-in-blur"
              style={{
                fontFamily: "Poppins",
                fontWeight: 500,
                fontStyle: "normal",
                fontSize: "42px",
                lineHeight: "48px",
                textAlign: "center",
                color: "var(--Interface-Color-Primary-900, #091917)",
                width: "920px",
                marginLeft: "auto",
                marginRight: "auto",
                marginTop: "160px",
                marginBottom: "18px",
                willChange: "opacity, transform, filter",
              }}
            >
              Scale Your AI Solution with Tangram AI’s ISV Partner Program
            </h1>

            {/* Description */}
            <p
              className="mx-auto max-w-[780px] text-center fade-in-section"
              style={{
                fontFamily: "Poppins",
                fontWeight: 400,
                fontStyle: "normal",
                fontSize: "16px",
                lineHeight: "26px",
                textAlign: "center",
                color: "var(--Interface-Color-Primary-900, #091917)",
                marginBottom: "46px",
                willChange: "opacity, transform",
              }}
            >
              Launch, monetize, and grow your <span style={{ fontWeight: 600 }}>enterprise-ready AI</span> and <span style={{ fontWeight: 600 }}>GenAI solutions</span> through Tangram AI’s <span style={{ fontWeight: 600 }}>ISV marketplace</span>, with built-in co-selling, go-to-market support, and seamless enterprise integration.
            </p>

            {/* Buttons */}
            <div className="flex justify-center items-center gap-4 scale-in">
              <button
                onClick={() => !isAuthenticated && openModal("auth", { mode: "login", role: "isv" })}
                disabled={isAuthenticated}
                className="border-gradient relative text-white rounded-[4px] px-[28px] transition-all"
                style={{
                  willChange: "transform",
                  display: "flex",
                  height: "48px",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  fontFamily: "Poppins, sans-serif",
                  fontWeight: 500,
                  fontSize: "14px",
                  lineHeight: "normal",
                  letterSpacing: "0.5px",
                  textTransform: "uppercase",
                  position: "relative",
                  padding: "20px 28px",
                  boxShadow: "0 0 20px rgba(255, 109, 27, 0.3), 0 0 40px rgba(75, 138, 255, 0.2), 0 0 60px rgba(107, 95, 255, 0.1)",
                  "--gradient-angle": "0deg",
                  border: "none",
                  outline: "none",
                  cursor: isAuthenticated ? "not-allowed" : "pointer",
                  opacity: 1,
                } as React.CSSProperties & { "--gradient-angle"?: string }}
              >
                {/* Text */}
                <span style={{
                  position: "relative",
                  zIndex: 10,
                  color: "#FFF",
                  textAlign: "center",
                  fontFamily: "Poppins",
                  fontSize: "14px",
                  fontStyle: "normal",
                  fontWeight: 500,
                  lineHeight: "normal",
                  letterSpacing: "0.5px",
                  textTransform: "uppercase",
                }}>
                  Become an ISV Partner
                </span>
              </button>
            </div>
            <div className="mt-6 text-center scale-in">
              <a
                href="#video-walkthrough"
                className="inline-flex items-center justify-center text-[#111111] font-medium no-underline hover:text-[#0b0b0b]"
                style={{
                  fontFamily: "Poppins",
                  fontSize: "14px",
                  lineHeight: "22px",
                  letterSpacing: "0.2px",
                  gap: "8px",
                }}
              >
                <Play className="w-4 h-4" aria-hidden="true" fill="currentColor" stroke="currentColor" />
                How It Works
              </a>
            </div>

            {/* Static Logo Row */}
            <div className="mt-16 md:mt-24 fade-in-section">
              <div className="max-w-[1100px] mx-auto flex flex-col items-center gap-6">
                <span
                  className="text-sm text-[#6b7280]"
                  style={{ fontFamily: "Poppins", letterSpacing: "0.1px" }}
                >
                  Trusted by leading teams
                </span>
                <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12 lg:gap-14">
                  <img src="/redington-logo.png" alt="Redington" className="h-8 w-auto object-contain" />
                  <Image src={veehiveLogo} alt="Veehive" className="h-8 w-auto object-contain" />
                  <img src="/Mozak_logo.png" alt="Mozark" className="h-8 w-auto object-contain" />
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* Build the Future Together Section */}
        <section id="how-it-works" className="w-full px-8 md:px-12 lg:px-16 pt-8 md:pt-12 lg:pt-16 pb-16 md:pb-20 lg:pb-24 bg-white fade-in-section" style={{ transform: "translateZ(0)", willChange: "transform" }}>
          <div className="max-w-[1209px] mx-auto">
            {/* Heading and Description */}
            <div className="flex flex-col gap-3 items-center text-center mb-16 md:mb-18">
              <h2
                className="fade-in-blur"
                style={{
                  textAlign: "center",
                  fontFamily: "Poppins",
                  fontSize: "32px",
                  fontStyle: "normal",
                  fontWeight: 600,
                  lineHeight: "normal",
                  background: "linear-gradient(90deg, #2F0368 0%, #5E04D2 100%)",
                  backgroundClip: "text",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  willChange: "opacity, transform, filter",
                }}
              >
                Build the Future Together
              </h2>
              <p
                className="fade-in-section"
                style={{
                  color: "var(--Interface-Color-Primary-900, #091917)",
                  textAlign: "center",
                  fontFamily: "Poppins",
                  fontSize: "16px",
                  fontStyle: "normal",
                  fontWeight: 400,
                  lineHeight: "normal",
                  maxWidth: "1100px",
                  margin: "0 auto",
                  willChange: "opacity, transform",
                }}
              >
                The Tangram.ai ISV Program empowers Independent Software Vendors to build, integrate, and scale on the Tangram.ai platform. Partners gain co-sell support, marketplace visibility, and go-to-market alignment — accelerating growth and expanding reach across the Tangram.ai ecosystem.
              </p>
            </div>

            {/* Feature Cards */}
            <div className="flex flex-col md:flex-row gap-2 items-stretch justify-center" style={{ gap: "0px", alignItems: "stretch" }}>
              {/* Card 1: Accelerate Project Successes */}
              <div
                className="flex flex-col gap-6 p-6 w-full md:w-[386.72px] relative bg-white card-divider stagger-item cursor-pointer"
                style={{
                  padding: "24.51px",
                  gap: "24.49px",
                  backgroundColor: "#FFFFFF",
                  position: "relative",
                }}
                onMouseEnter={() => setHoveredCard1(true)}
                onMouseLeave={() => setHoveredCard1(false)}
              >
                {/* Icon */}
                <div
                  className="bg-[#181818] rounded-[8.17px] flex items-center justify-center shrink-0 relative z-10"
                  style={{
                    width: "49.02px",
                    height: "49.02px",
                  }}
                >
                  <div
                    className="bg-[#181818] rounded-[8.17px] flex items-center justify-center shrink-0 relative z-10"
                    style={{
                      width: "49.02px",
                      height: "49.02px",
                    }}
                  >
                    <Target className="w-6 h-6 text-white" />
                  </div>
                </div>

                {/* Content */}
                <div
                  className="flex flex-col flex-1 relative z-10"
                  style={{
                    gap: "7.935px",
                  }}
                >
                  <h3
                    className="fade-in-blur transition-all duration-300"
                    style={{
                      color: hoveredCard1 ? "transparent" : "#181818",
                      fontFamily: "Poppins",
                      fontSize: "clamp(16px, 4vw, 20px)",
                      fontStyle: "normal",
                      fontWeight: 500,
                      lineHeight: "150%",
                      letterSpacing: "-0.4px",
                      willChange: "opacity, transform, filter",
                      background: hoveredCard1 ? "linear-gradient(90deg, #0013A2 0%, #D00004 100%)" : "none",
                      backgroundClip: hoveredCard1 ? "text" : "unset",
                      WebkitBackgroundClip: hoveredCard1 ? "text" : "unset",
                      WebkitTextFillColor: hoveredCard1 ? "transparent" : "unset",
                    }}
                  >
                    Accelerate Project Successes
                  </h3>
                  <p
                    style={{
                      color: "#65717C",
                      fontFamily: "Poppins",
                      fontSize: "clamp(14px, 3.5vw, 16px)",
                      fontStyle: "normal",
                      fontWeight: 400,
                      lineHeight: "150%",
                      letterSpacing: "-0.4px",
                    }}
                  >
                    Work with our partner ecosystem and access industry expertise and resources to help you achieve exceptional results.
                  </p>
                </div>
              </div>

              {/* Card 2: Scale your operations globally */}
              <div
                className="flex flex-col gap-6 p-6 w-full md:w-[386.72px] relative bg-white card-divider stagger-item cursor-pointer"
                style={{
                  padding: "24.51px",
                  gap: "24.49px",
                  backgroundColor: "#FFFFFF",
                  position: "relative",
                }}
                onMouseEnter={() => setHoveredCard2(true)}
                onMouseLeave={() => setHoveredCard2(false)}
              >
                {/* Icon */}

                <div
                  className="bg-[#181818] rounded-[8.17px] flex items-center justify-center shrink-0 relative z-10"
                  style={{
                    width: "49.02px",
                    height: "49.02px",
                  }}
                >
                  <Globe className="w-6 h-6 text-white" />
                </div>

                {/* Content */}
                <div
                  className="flex flex-col flex-1 relative z-10"
                  style={{
                    gap: "7.935px",
                  }}
                >
                  <h3
                    className="fade-in-blur transition-all duration-300"
                    style={{
                      color: hoveredCard2 ? "transparent" : "#181818",
                      fontFamily: "Poppins",
                      fontSize: "clamp(16px, 4vw, 20px)",
                      fontStyle: "normal",
                      fontWeight: 500,
                      lineHeight: "150%",
                      letterSpacing: "-0.4px",
                      whiteSpace: "nowrap",
                      willChange: "opacity, transform, filter",
                      background: hoveredCard2 ? "linear-gradient(90deg, #0013A2 0%, #D00004 100%)" : "none",
                      backgroundClip: hoveredCard2 ? "text" : "unset",
                      WebkitBackgroundClip: hoveredCard2 ? "text" : "unset",
                      WebkitTextFillColor: hoveredCard2 ? "transparent" : "unset",
                    }}
                  >
                    Scale your operations globally
                  </h3>
                  <p
                    style={{
                      color: "#65717C",
                      fontFamily: "Poppins",
                      fontSize: "clamp(14px, 3.5vw, 16px)",
                      fontStyle: "normal",
                      fontWeight: 400,
                      lineHeight: "150%",
                      letterSpacing: "-0.4px",
                    }}
                  >
                    Enter new markets while accelerating your business's international reach with global partners or local experts.
                  </p>
                </div>
              </div>

              {/* Card 3: Get faster business results */}
              <div
                className="flex flex-col gap-6 p-6 w-full md:w-[386.72px] relative bg-white stagger-item cursor-pointer"
                style={{
                  padding: "24.51px",
                  gap: "24.49px",
                  backgroundColor: "#FFFFFF",
                  position: "relative",
                }}
                onMouseEnter={() => setHoveredCard3(true)}
                onMouseLeave={() => setHoveredCard3(false)}
              >
                {/* Icon */}
                <div
                  className="bg-[#181818] rounded-[8.17px] flex items-center justify-center shrink-0 relative z-10"
                  style={{
                    width: "49.02px",
                    height: "49.02px",
                  }}
                >
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>

                {/* Content */}
                <div
                  className="flex flex-col flex-1 relative z-10"
                  style={{
                    gap: "7.935px",
                  }}
                >
                  <h3
                    className="fade-in-blur transition-all duration-300"
                    style={{
                      color: hoveredCard3 ? "transparent" : "#181818",
                      fontFamily: "Poppins",
                      fontSize: "clamp(16px, 4vw, 20px)",
                      fontStyle: "normal",
                      fontWeight: 500,
                      lineHeight: "150%",
                      letterSpacing: "-0.4px",
                      willChange: "opacity, transform, filter",
                      background: hoveredCard3 ? "linear-gradient(90deg, #0013A2 0%, #D00004 100%)" : "none",
                      backgroundClip: hoveredCard3 ? "text" : "unset",
                      WebkitBackgroundClip: hoveredCard3 ? "text" : "unset",
                      WebkitTextFillColor: hoveredCard3 ? "transparent" : "unset",
                    }}
                  >
                    Get faster business results
                  </h3>
                  <p
                    style={{
                      color: "#65717C",
                      fontFamily: "Poppins",
                      fontSize: "clamp(14px, 3.5vw, 16px)",
                      fontStyle: "normal",
                      fontWeight: 400,
                      lineHeight: "150%",
                      letterSpacing: "-0.4px",
                    }}
                  >
                    Reduce time to deployment and accelerate projects with pre-configured, industry specific solutions.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ISV Testimonials - Static Row Layout */}
        <section id="video-walkthrough" className="w-full px-4 md:px-8 lg:px-12 pt-12 md:pt-16 lg:pt-20 pb-16 md:pb-20 lg:pb-24 fade-in-section" style={{ backgroundColor: "#F9FAFB", transform: "translateZ(0)", willChange: "transform" }}>
          <div className="max-w-[1200px] mx-auto">
            <div className="text-left mb-12 space-y-2">
              <h2 className="text-3xl md:text-4xl font-semibold text-[#161d26]">From Build to Scale</h2>
              <p className="text-sm md:text-base text-[#4b5563]">
                Partner stories across the entire AI product lifecycle.
              </p>
            </div>
            <div className="flex flex-col lg:flex-row items-stretch gap-4">
              {/* Left small card */}
              <div
                className="w-[220px] min-w-[220px] min-h-[320px] flex-none rounded-2xl text-white relative overflow-hidden flex flex-col"
                style={{
                  backgroundImage: `url(${leftCardPortrait.src})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              >
                <div className="absolute inset-0 bg-black/30" />
                <div className="relative z-10 h-[320px] flex flex-col justify-between pt-3 px-4 pb-4">
                  <div className="flex items-center justify-end text-sm opacity-90 gap-3">
                    <button
                      type="button"
                      aria-label="Play video"
                      className="w-6 h-6 rounded-full border border-white/60 text-white flex items-center justify-center bg-transparent hover:bg-white/10 focus:outline-none transition"
                    >
                      <Play className="w-2.5 h-2.5" fill="currentColor" stroke="currentColor" />
                    </button>
                  </div>
                  <div className="grid items-center gap-3 justify-start mt-auto">
                    <div className="text-sm leading-tight">
                    <div>V S Hariharan</div>
                    <div className="opacity-80 text-xs">MD & Group CEO - Redington</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right text block */}
              <div className="flex-[2] bg-white rounded-2xl p-0 border border-gray-100 relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=crop&w=800&q=80')] bg-cover bg-center opacity-10 pointer-events-none" />
                <div className="absolute inset-0 bg-gradient-to-br from-white via-white/90 to-white/75 pointer-events-none" />
                <div className="relative z-10">
                  <div className="flex flex-col md:flex-row gap-4 items-start md:items-end bg-white">
                    <div
                      className="w-full md:w-[220px] min-h-[320px] rounded-2xl text-white relative overflow-hidden flex flex-col"
                      style={{
                        backgroundImage: `url(${veehivePortrait.src})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                      }}
                    >
                      <div className="absolute inset-0 bg-black/30" />
                      <div className="relative z-10 h-[320px] flex flex-col justify-between pt-3 px-4 pb-4">
                        <div className="flex items-center justify-end text-sm opacity-90 gap-2">
                          <button
                            type="button"
                            aria-label="Play video"
                            className="w-6 h-6 rounded-full border border-white/60 text-white flex items-center justify-center bg-transparent hover:bg-white/10 focus:outline-none transition"
                          >
                            <Play className="w-2.5 h-2.5" fill="currentColor" stroke="currentColor" />
                          </button>
                        </div>
                        <div className="grid items-center gap-3 justify-start mt-auto">
                          <div className="text-sm leading-tight">
                            <div>Sathish Jeyakumar</div>
                            <div className="opacity-80 text-xs">CEO - Veehive</div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex-1 pl-3 pr-3 md:pl-4 md:pr-4">
                      <div className="mb-4">
                        <Image
                          src={veehiveLogo}
                          alt="Veehive logo"
                          width={110}
                          height={30}
                          className="h-auto w-[110px]"
                        />
                      </div>
                      <p className="text-[#111] text-base leading-relaxed mb-4">
                        Tangram AI helped us evolve our AI solution into an <span style={{ fontWeight: 600 }}>enterprise-ready, scalable product</span>. With access to the <span style={{ fontWeight: 600 }}>ISV marketplace and co-sell support</span>, we shortened time-to-market <span style={{ fontWeight: 600 }}>by ~30–40%</span> and enabled adoption across <span style={{ fontWeight: 600 }}>multiple enterprise use cases</span>.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Duplicate small card */}
              <div
                className="w-[220px] min-w-[220px] min-h-[320px] flex-none rounded-2xl text-white relative overflow-hidden flex flex-col"
                style={{
                  backgroundImage: `url(${rightCardPortrait.src})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              >
                <div className="absolute inset-0 bg-black/30" />
                <div className="relative z-10 h-[320px] flex flex-col justify-between pt-3 px-4 pb-4">
                  <div className="flex items-center justify-end text-sm opacity-90 gap-2">
                    <button
                      type="button"
                      aria-label="Play video"
                      className="w-6 h-6 rounded-full border border-white/60 text-white flex items-center justify-center bg-transparent hover:bg-white/10 focus:outline-none transition"
                    >
                      <Play className="w-2.5 h-2.5" fill="currentColor" stroke="currentColor" />
                    </button>
                  </div>
                  <div className="grid items-center gap-2 justify-start mt-auto">
                    <div className="text-sm leading-tight">
                    <div>Chandrasekar Ramamoorthy</div>
                    <div className="opacity-80 text-xs">CEO - MOZARK</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="w-full px-8 md:px-12 lg:px-16 py-16 md:py-20 lg:py-24 bg-white fade-in-section" style={{ transform: "translateZ(0)", willChange: "transform" }}>
          <div className="max-w-[1200px] mx-auto">
            {/* Simplified FAQ layout */}
            <div className="px-0 py-4 rounded-none mb-8">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-12">
                <h2 className="text-3xl md:text-4xl font-semibold text-[#161d26]">FAQ</h2>
                <div className="flex flex-wrap gap-3">
                  {Array.from(new Set(faqEntries.map((e) => e.section))).map((section) => (
                    <button
                      key={section}
                      onClick={() => setFaqFilter(section)}
                      className={`rounded-full px-4 py-2 text-sm transition ${
                        faqFilter === section
                          ? "bg-[#161d26] text-white"
                          : "bg-white text-[#161d26] border border-gray-300 hover:bg-gray-100"
                      }`}
                    >
                      {section}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex flex-col divide-y divide-gray-300 border-b border-gray-300">
                {faqEntries
                  .filter((item) => item.section === faqFilter)
                  .map((item, idx) => {
                    const open = expandedFaq === idx
                  return (
                    <div key={item.q}>
                      <button
                        onClick={() => setExpandedFaq(open ? null : idx)}
                        className="w-full flex items-center justify-between py-5"
                        aria-expanded={open}
                      >
                        <span className={`text-[18px] text-[#161d26] text-left ${open ? "font-medium" : "font-normal"}`}>
                          {item.q}
                        </span>
                        <span className="text-2xl text-[#161d26]">{open ? "−" : "+"}</span>
                      </button>
                      <div
                        className="overflow-hidden transition-all duration-300"
                        style={{
                          maxHeight: open ? "400px" : "0px",
                          opacity: open ? 1 : 0,
                        }}
                      >
                        <p className="text-[16px] text-[#1a232d] pb-5 pr-2">
                          {item.a}
                        </p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Legacy detailed FAQ (hidden) */}
            <div className="flex flex-col md:flex-row gap-8 md:gap-[32px] items-start hidden">
              {/* Left Column - Heading */}
              <div className="w-full md:w-[481.33px] shrink-0">
                <div className="sticky top-0">
                  <h2
                    className="fade-in-blur"
                    style={{
                      fontFamily: "Poppins, sans-serif",
                      fontWeight: 600,
                      fontStyle: "normal",
                      fontSize: "32px",
                      lineHeight: "normal",
                      background: "linear-gradient(90deg, #002e84 0%, #1157d9 100%)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                      willChange: "opacity, transform, filter",
                    }}
                  >
                    frequently asked questions<br />
                    FAQ's
                  </h2>
                </div>
              </div>

              {/* Spacer */}
              <div className="hidden md:block w-[70.66px] shrink-0" />

              {/* Right Column - FAQ Items */}
              <div className="flex-1 w-full md:w-[584px]">
                {/* FAQ Item 1 */}
                <div className="fade-in-section">
                  <button
                    onClick={() => setExpandedFaq(expandedFaq === 0 ? null : 0)}
                    className="w-full flex items-center justify-between px-2 py-6 transition-all duration-300 hover:opacity-80"
                    style={{
                      paddingTop: "24px",
                      paddingBottom: "24px",
                    }}
                  >
                    <h3
                      className="fade-in-blur"
                      style={{
                        color: "#161D26",
                        fontFamily: "Poppins",
                        fontSize: "17.4px",
                        fontStyle: "normal",
                        fontWeight: 500,
                        lineHeight: "23.99px",
                        willChange: "opacity, transform, filter",
                      }}
                    >
                      Incentives for Sales teams
                    </h3>
                    <div
                      style={{
                        width: "24px",
                        height: "24px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        position: "relative",
                      }}
                    >
                      <div
                        style={{
                          position: "absolute",
                          transition: "opacity 0.3s ease, transform 0.3s ease",
                          opacity: expandedFaq === 0 ? 1 : 0,
                          transform: expandedFaq === 0 ? "rotate(0deg) scale(1)" : "rotate(90deg) scale(0)",
                        }}
                      >
                        <X className="w-4 h-4 text-[#161d26]" />
                      </div>
                      <div
                        style={{
                          position: "absolute",
                          transition: "opacity 0.3s ease, transform 0.3s ease",
                          opacity: expandedFaq === 0 ? 0 : 1,
                          transform: expandedFaq === 0 ? "rotate(-90deg) scale(0)" : "rotate(0deg) scale(1)",
                        }}
                      >
                        <Plus className="w-4 h-4 text-[#161d26]" />
                      </div>
                    </div>
                  </button>
                  <div
                    className="overflow-hidden transition-all duration-300 ease-in-out"
                    style={{
                      maxHeight: expandedFaq === 0 ? "500px" : "0",
                      opacity: expandedFaq === 0 ? 1 : 0,
                    }}
                  >
                    <div className="px-2 pb-6">
                      <p style={{
                        fontFamily: "Poppins, sans-serif",
                        fontWeight: 400,
                        fontSize: "16px",
                        lineHeight: "1.5",
                        color: "#34414e",
                      }}>
                        Our ISV program offers competitive incentives for sales teams, including revenue sharing, performance bonuses, and co-marketing opportunities. Sales teams can earn additional commissions and rewards for successfully integrating and selling Tangram.ai solutions to their clients.
                      </p>
                    </div>
                  </div>
                </div>

                {/* FAQ Item 2 */}
                <div className="border-t fade-in-section" style={{ borderColor: "#D1D6DB" }}>
                  <button
                    onClick={() => setExpandedFaq(expandedFaq === 1 ? null : 1)}
                    className="w-full flex items-center justify-between px-2 py-6 transition-all duration-300 hover:opacity-80"
                    style={{
                      paddingTop: "24px",
                      paddingBottom: "24px",
                    }}
                  >
                    <h3
                      className="fade-in-blur"
                      style={{
                        fontFamily: "Poppins, sans-serif",
                        fontWeight: 500,
                        fontStyle: "normal",
                        fontSize: "18px",
                        lineHeight: "23.99px",
                        color: "#161d26",
                        willChange: "opacity, transform, filter",
                      }}
                    >
                      Drive visibility with Tangram.ai Sales
                    </h3>
                    <div
                      style={{
                        width: "24px",
                        height: "24px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        position: "relative",
                      }}
                    >
                      <div
                        style={{
                          position: "absolute",
                          transition: "opacity 0.3s ease, transform 0.3s ease",
                          opacity: expandedFaq === 1 ? 1 : 0,
                          transform: expandedFaq === 1 ? "rotate(0deg) scale(1)" : "rotate(90deg) scale(0)",
                        }}
                      >
                        <X className="w-4 h-4 text-[#161d26]" />
                      </div>
                      <div
                        style={{
                          position: "absolute",
                          transition: "opacity 0.3s ease, transform 0.3s ease",
                          opacity: expandedFaq === 1 ? 0 : 1,
                          transform: expandedFaq === 1 ? "rotate(-90deg) scale(0)" : "rotate(0deg) scale(1)",
                        }}
                      >
                        <Plus className="w-4 h-4 text-[#161d26]" />
                      </div>
                    </div>
                  </button>
                  <div
                    className="overflow-hidden transition-all duration-300 ease-in-out"
                    style={{
                      maxHeight: expandedFaq === 1 ? "500px" : "0",
                      opacity: expandedFaq === 1 ? 1 : 0,
                    }}
                  >
                    <div className="px-2 pb-6">
                      <p style={{
                        fontFamily: "Poppins, sans-serif",
                        fontWeight: 400,
                        fontSize: "16px",
                        lineHeight: "1.5",
                        color: "#34414e",
                      }}>
                        Partner with Tangram.ai to increase your brand visibility and reach. Our sales team works closely with ISV partners to co-sell solutions, providing joint marketing materials, sales enablement resources, and access to our customer base to help drive your business growth.
                      </p>
                    </div>
                  </div>
                </div>

                {/* FAQ Item 3 */}
                <div className="border-t fade-in-section" style={{ borderColor: "#D1D6DB" }}>
                  <button
                    onClick={() => setExpandedFaq(expandedFaq === 2 ? null : 2)}
                    className="w-full flex items-center justify-between px-2 py-6 transition-all duration-300 hover:opacity-80"
                    style={{
                      paddingTop: "24px",
                      paddingBottom: "24px",
                    }}
                  >
                    <h3
                      className="fade-in-blur"
                      style={{
                        fontFamily: "Poppins, sans-serif",
                        fontWeight: 500,
                        fontStyle: "normal",
                        fontSize: "17.2px",
                        lineHeight: "23.99px",
                        color: "#161d26",
                        willChange: "opacity, transform, filter",
                      }}
                    >
                      Focused co-sell support and resources
                    </h3>
                    <div
                      style={{
                        width: "24px",
                        height: "24px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        position: "relative",
                      }}
                    >
                      <div
                        style={{
                          position: "absolute",
                          transition: "opacity 0.3s ease, transform 0.3s ease",
                          opacity: expandedFaq === 2 ? 1 : 0,
                          transform: expandedFaq === 2 ? "rotate(0deg) scale(1)" : "rotate(90deg) scale(0)",
                        }}
                      >
                        <X className="w-4 h-4 text-[#161d26]" />
                      </div>
                      <div
                        style={{
                          position: "absolute",
                          transition: "opacity 0.3s ease, transform 0.3s ease",
                          opacity: expandedFaq === 2 ? 0 : 1,
                          transform: expandedFaq === 2 ? "rotate(-90deg) scale(0)" : "rotate(0deg) scale(1)",
                        }}
                      >
                        <Plus className="w-4 h-4 text-[#161d26]" />
                      </div>
                    </div>
                  </button>
                  <div
                    className="overflow-hidden transition-all duration-300 ease-in-out"
                    style={{
                      maxHeight: expandedFaq === 2 ? "500px" : "0",
                      opacity: expandedFaq === 2 ? 1 : 0,
                    }}
                  >
                    <div className="px-2 pb-6">
                      <p style={{
                        fontFamily: "Poppins, sans-serif",
                        fontWeight: 400,
                        fontSize: "16px",
                        lineHeight: "1.5",
                        color: "#34414e",
                      }}>
                        We provide dedicated co-sell support to help you succeed. This includes technical resources, sales training, marketing collateral, and a dedicated partner success manager who works with you to identify opportunities, develop go-to-market strategies, and ensure successful customer implementations.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
      {/* End of content wrapper */}
    </div>
  )
}


