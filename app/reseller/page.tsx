"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "../../components/ui/button"
import { Card } from "../../components/ui/card"
import Image from "next/image"
import { useModal } from "../../hooks/use-modal"
import { useAuthStore } from "../../lib/store/auth.store"
import { useRouter } from "next/navigation"
import { Target, Globe, TrendingUp, Play, Plus, X } from "lucide-react"
import veehiveLogo from "../../assets/image-470636c9-6efb-42e4-8eb7-65103b1c7a7d.png"
import veehivePortrait from "../../assets/image-9fe0672b-99a3-4e00-8069-a8377de93483.png"
import leftCardPortrait from "../../assets/image-95aa0dfb-52a9-414a-9056-bf42ddc01c6d.png"
import rightCardPortrait from "../../assets/image-e8bc3a81-91bd-425f-9ff9-c98c08858e28.png"

export default function ResellerPage() {
  const { openModal } = useModal()
  const { user, isAuthenticated } = useAuthStore()
  const router = useRouter()
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null)
  const [faqFilter, setFaqFilter] = useState<string>("General")

  // Hover states for feature cards
  const [hoveredCard1, setHoveredCard1] = useState(false)
  const [hoveredCard2, setHoveredCard2] = useState(false)
  const [hoveredCard3, setHoveredCard3] = useState(false)

  // Mouse position state for radial hover effect (in pixels relative to hero section)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const heroSectionRef = useRef<HTMLElement>(null)

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
  const handleResellerLogin = () => {
    if (isAuthenticated && user?.role === 'reseller') {
      router.push('/dashboard')
    } else {
      openModal("auth", { mode: "login", role: "reseller" })
    }
  }

  const faqEntries = [
    // General
    { section: "General", q: "What is the Tangram AI Reseller Program?", a: "It enables partners to resell, co-sell, and deliver enterprise-ready AI agents and solutions using Tangram AI’s platform, pre-built agents, and enterprise capabilities to accelerate adoption and create recurring revenue." },
    { section: "General", q: "Who should join the Tangram AI Reseller Program?", a: "Ideal for system integrators, IT service providers, AI consultancies, digital transformation firms, managed service providers, and enterprise software resellers serving B2B or enterprise customers." },
    { section: "General", q: "Is the Tangram AI Reseller Program global?", a: "Yes. Tangram AI supports reseller partnerships across multiple regions, subject to commercial, regulatory, and compliance considerations." },
    { section: "General", q: "How long does it take to become a Tangram AI reseller?", a: "Partner approval and onboarding typically take 1–2 weeks, depending on business alignment, documentation, and onboarding readiness." },
    { section: "General", q: "Is there a cost to join the Tangram AI Reseller Program?", a: "There is no upfront fee to apply. Commercial terms are defined as part of the reseller agreement." },

    // Business
    { section: "Business", q: "How do resellers generate revenue with Tangram AI?", a: "Through software license resale, subscription-based recurring revenue, implementation and integration services, custom AI agent development, and managed or support services." },
    { section: "Business", q: "Does Tangram AI support co-selling?", a: "Yes. Partners can lead the relationship while Tangram AI provides solution expertise, demos, and enterprise support." },
    { section: "Business", q: "Do resellers own the customer relationship?", a: "Yes. In reseller-led engagements, partners own the customer relationship while Tangram AI supports delivery, escalation, and platform success." },
    { section: "Business", q: "Is deal registration available?", a: "Yes. Tangram AI offers deal registration to protect partner opportunities and prevent channel conflict." },
    { section: "Business", q: "Can resellers white-label Tangram AI solutions?", a: "White-label options may be available depending on the engagement model and agreement terms." },

    // Value
    { section: "Value", q: "What business value does Tangram AI provide to resellers?", a: "Helps partners reduce AI solution build time, increase average deal size, deliver enterprise-grade AI without heavy R&D, create predictable recurring revenue, and differentiate with production-ready agents." },
    { section: "Value", q: "How does Tangram AI help partners win enterprise deals?", a: "Provides pre-built AI agents, demo environments, solution architectures, enterprise documentation, and co-selling support to close deals faster." },
    { section: "Value", q: "What makes Tangram AI different from other AI platforms?", a: "Tangram AI focuses on enterprise-ready AI agents with built-in governance, scalability, and integration capabilities for real-world business use cases." },
    { section: "Value", q: "Can Tangram AI help partners enter new industries?", a: "Yes. Solutions are industry-agnostic and can be tailored for banking, retail, healthcare, telecom, travel, logistics, and other verticals." },

    // Commercial
    { section: "Commercial", q: "How is pricing structured for Tangram AI resellers?", a: "Pricing is based on partner tier, deal size, region, and engagement model. Resellers receive preferential pricing versus direct enterprise customers." },
    { section: "Commercial", q: "Does Tangram AI support subscription-based pricing?", a: "Yes. Subscription and usage-based pricing models are supported to enable recurring revenue." },
    { section: "Commercial", q: "Can resellers define their own customer pricing?", a: "In most cases, resellers can set end-customer pricing while following agreed commercial guidelines." },
    { section: "Commercial", q: "Are there different reseller tiers?", a: "Yes. Tangram AI offers tiered reseller levels based on performance, capability, and engagement, with increasing benefits and incentives." },
    { section: "Commercial", q: "Are enterprise contracts supported?", a: "Yes. Tangram AI supports enterprise-grade contracts, including multi-year agreements and volume-based pricing." },

    // Technical
    { section: "Technical", q: "Do resellers need deep AI or machine learning expertise?", a: "No. Tangram AI abstracts AI complexity through pre-built agents and workflows; technical partners can extend or customize when needed." },
    { section: "Technical", q: "How are Tangram AI solutions deployed?", a: "Tangram AI supports secure cloud-based deployments and enterprise integration models based on customer requirements." },
    { section: "Technical", q: "Can Tangram AI integrate with existing enterprise systems?", a: "Yes. Tangram AI integrates with CRMs, ERPs, data platforms, internal APIs, and other enterprise systems." },
    { section: "Technical", q: "Is customization supported?", a: "Yes. AI agents can be configured, extended, and customized to match specific customer workflows and business needs." },
    { section: "Technical", q: "Who handles implementation and maintenance?", a: "Implementation can be handled by the reseller, Tangram AI, or through a joint delivery model." },

    // Enterprise
    { section: "Enterprise", q: "Is Tangram AI suitable for large enterprises?", a: "Yes. Tangram AI is designed for enterprise-scale deployments with governance, security, and scalability." },
    { section: "Enterprise", q: "How does Tangram AI address data security?", a: "Tangram AI follows enterprise-grade security practices including access controls, data isolation, and secure deployment architectures." },
    { section: "Enterprise", q: "Can Tangram AI be used in regulated industries?", a: "Yes. Tangram AI supports deployments in regulated industries, subject to customer compliance requirements." },
    { section: "Enterprise", q: "Does Tangram AI support multi-tenant environments?", a: "Yes. Tangram AI supports multi-tenant and multi-account architectures for enterprises and partners." },
    { section: "Enterprise", q: "Is auditability supported?", a: "Yes. Tangram AI provides logging and monitoring to meet enterprise audit and governance needs." },

    // Support
    { section: "Support", q: "What support does Tangram AI provide to resellers?", a: "Resellers receive onboarding support, technical documentation, partner enablement, and escalation channels based on partner tier." },
    { section: "Support", q: "Is training available for reseller teams?", a: "Yes. Tangram AI provides product training, sales enablement, and technical onboarding resources." },
    { section: "Support", q: "Are SLAs available?", a: "Yes. Enterprise-grade SLAs are available depending on the customer agreement and deployment model." },

    // Legal
    { section: "Legal", q: "What agreements are required to become a reseller?", a: "Resellers must sign a Tangram AI reseller or partner agreement defining commercial, legal, and operational terms." },
    { section: "Legal", q: "Who owns the intellectual property?", a: "Tangram AI retains ownership of its platform and core IP, while partners retain ownership of their proprietary services and extensions." },
    { section: "Legal", q: "How is compliance managed?", a: "Compliance responsibilities are defined contractually and aligned with customer, regional, and regulatory requirements." },
  ]

  return (
    <div className="min-h-screen" style={{ scrollBehavior: "smooth" }}>
      {/* Content wrapper */}
      <div style={{ position: 'relative', zIndex: 1 }}>
        {/* Hero Section with Gradient */}
        <section ref={heroSectionRef} className="relative overflow-hidden min-h-[90vh]" style={{ transform: "translateZ(0)", willChange: "scroll-position" }}>
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
              background: "radial-gradient(100% 100% at 50% 0%, #DDFFED 0%, #FFFFFF 100%)",
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
                width: "100%",
                maxWidth: "1280px",
                marginLeft: "auto",
                marginRight: "auto",
                marginTop: "160px",
                marginBottom: "18px",
              }}
            >
              Drive New Revenue with 1,000+ AI Agents<br />
              Across a Growin ISV Ecosystem
            </h1>

            {/* Description */}
            <p
              className="mx-auto max-w-2xl text-center fade-in-section"
              style={{
                fontFamily: "Poppins",
                fontWeight: 400,
                fontStyle: "normal",
                fontSize: "16px",
                lineHeight: "26px",
                textAlign: "center",
                color: "var(--Interface-Color-Primary-900, #091917)",
                maxWidth: "780px",
                marginLeft: "auto",
                marginRight: "auto",
                marginBottom: "46px",
                willChange: "opacity, transform",
              }}
            >
              Refer, resell, co-sell, or bundle enterprise-ready AI agents from the Tangram AI Store to expand your offerings, grow your pipeline, close larger enterprise deals, and build predictable recurring revenue.
            </p>

            {/* Buttons */}
            <div className="flex justify-center scale-in">
              <button
                onClick={handleResellerLogin}
                disabled={isAuthenticated}
                className="border-gradient relative text-white rounded-[4px] px-[28px] transition-all"
                style={{
                  willChange: "transform",
                  display: "flex",
                  height: "48px",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  fontFamily: "Poppins",
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
                  Become a Reseller Partner
                </span>
              </button>
            </div>

            {/* Trusted by row */}
            <div className="mt-24 md:mt-32 fade-in-section">
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
        <section className="w-full px-8 md:px-12 lg:px-16 pt-8 md:pt-12 lg:pt-16 pb-16 md:pb-20 lg:pb-24 bg-white" style={{ transform: "translateZ(0)", contain: "layout style paint" }}>
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
                  background: "linear-gradient(90deg, #2D8E0C 0%, #77C402 100%)",
                  backgroundClip: "text",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Are You a Good Fit?
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
                  maxWidth: "900px",
                  margin: "0 auto",
                }}
              >
                You're a good fit for the Tangram.ai Reseller Program if you help clients adopt AI-driven solutions and want to expand your portfolio with enterprise-ready intelligence.
              </p>
            </div>

            {/* Feature Cards */}
            <div className="flex flex-col md:flex-row gap-2 items-stretch justify-center" style={{ gap: "0px", alignItems: "stretch" }}>
              {/* Card 1: AI Consultants & Solution Providers */}
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
                  <Target className="w-6 h-6 text-white" />
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
                      fontSize: "19px",
                      fontStyle: "normal",
                      fontWeight: 500,
                      lineHeight: "150%",
                      letterSpacing: "-0.4px",
                      background: hoveredCard1 ? "linear-gradient(90deg, #0013A2 0%, #D00004 100%)" : "none",
                      backgroundClip: hoveredCard1 ? "text" : "unset",
                      WebkitBackgroundClip: hoveredCard1 ? "text" : "unset",
                      WebkitTextFillColor: hoveredCard1 ? "transparent" : "unset",
                    }}
                  >
                    AI Consultants & Solution Providers
                  </h3>
                  <p
                    style={{
                      color: "#65717C",
                      fontFamily: "Poppins",
                      fontSize: "16px",
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

              {/* Card 2: IT Consultants & Service Providers */}
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
                      fontSize: "19px",
                      fontStyle: "normal",
                      fontWeight: 500,
                      lineHeight: "150%",
                      letterSpacing: "-0.4px",
                      background: hoveredCard2 ? "linear-gradient(90deg, #0013A2 0%, #D00004 100%)" : "none",
                      backgroundClip: hoveredCard2 ? "text" : "unset",
                      WebkitBackgroundClip: hoveredCard2 ? "text" : "unset",
                      WebkitTextFillColor: hoveredCard2 ? "transparent" : "unset",
                    }}
                  >
                    IT Consultants & Service Providers
                  </h3>
                  <p
                    style={{
                      color: "#65717C",
                      fontFamily: "Poppins",
                      fontSize: "16px",
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

              {/* Card 3: AI Enterprise and GTM Agencies */}
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
                      fontSize: "19px",
                      fontStyle: "normal",
                      fontWeight: 500,
                      lineHeight: "150%",
                      letterSpacing: "-0.4px",
                      background: hoveredCard3 ? "linear-gradient(90deg, #0013A2 0%, #D00004 100%)" : "none",
                      backgroundClip: hoveredCard3 ? "text" : "unset",
                      WebkitBackgroundClip: hoveredCard3 ? "text" : "unset",
                      WebkitTextFillColor: hoveredCard3 ? "transparent" : "unset",
                    }}
                  >
                    AI Enterprise and GTM Agencies
                  </h3>
                  <p
                    style={{
                      color: "#65717C",
                      fontFamily: "Poppins",
                      fontSize: "16px",
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

        {/* Benefits of Reseller Partnership */}
        <section
          className="relative"
          style={{
            width: "100%",
            height: "698px",
            background: "linear-gradient(180deg, #FFFFFF 0%, #E8F6F7 76.44%, #FAFAFA 100%)",
            margin: "0 auto",
            transform: "translateZ(0)",
            contain: "layout style paint",
            willChange: "scroll-position",
          }}
        >
          <div className="w-full h-full px-8 md:px-12 lg:px-16 flex items-center justify-center">
            <div className="flex flex-col md:flex-row gap-12 items-start w-full max-w-6xl">
              {/* Left side - Text content */}
              <div className="flex-1 md:w-1/2">
                <h2
                  className="mb-6 fade-in-blur"
                  style={{
                    fontFamily: "Poppins, sans-serif",
                    fontWeight: 600,
                    fontStyle: "normal",
                    fontSize: "32px",
                    lineHeight: "100%",
                    letterSpacing: "0px",
                    verticalAlign: "middle",
                    background: "linear-gradient(90deg, #02341A 0%, #006E84 100%)",
                    WebkitBackgroundClip: "text",
                    backgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    color: "transparent",
                  }}
                >
                  Benefits of Reseller Partnership
                </h2>
                <p
                  className="fade-in-section"
                  style={{
                    fontFamily: "Poppins, sans-serif",
                    fontWeight: 400,
                    fontStyle: "normal",
                    fontSize: "18px",
                    lineHeight: "150%",
                    letterSpacing: "0px",
                    color: "#374151",
                  }}
                >
                  Partnering with Tangram.ai unlocks new revenue streams, faster deal cycles, and access to enterprise-ready AI solutions. Resellers gain co-selling support, marketing enablement, and dedicated partner success resources — empowering them to deliver intelligent, scalable value to every client.
                </p>
              </div>

              {/* Right side - Benefits cards in 2x2 grid */}
              <div className="flex-1 md:w-1/2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Card 1: Up to 40% off */}
                  <div
                    className="relative rounded-lg overflow-hidden w-full md:w-[258px] h-[120px] md:h-[151px] stagger-item transition-all duration-300 hover:scale-105"
                    style={{ willChange: "transform" }}
                  >
                    {/* Background Mask Image */}
                    <div
                      className="absolute inset-0 pointer-events-none w-full h-full"
                      style={{
                        zIndex: 0,
                      }}
                    >
                      <Image
                        src="/Mask group.png"
                        alt=""
                        fill
                        className="object-cover"
                        unoptimized
                        style={{
                          objectFit: "cover",
                          width: "100%",
                          height: "100%",
                        }}
                      />
                    </div>

                    {/* Card Content */}
                    <div
                      className="relative bg-white rounded-lg p-3 md:p-6 flex flex-col items-start text-left"
                      style={{
                        border: "1px dashed #D1D5DB",
                        zIndex: 1,
                      }}
                    >
                      <Image
                        src="/percentage-round.png"
                        alt="Percentage"
                        width={24}
                        height={24}
                        className="object-contain mb-2 md:mb-4 w-5 h-5 md:w-6 md:h-6"
                        unoptimized
                      />
                      <p
                        className="text-xs md:text-sm"
                        style={{
                          fontFamily: "Poppins, sans-serif",
                          fontWeight: 500,
                          lineHeight: "140%",
                          color: "#111827",
                        }}
                      >
                        Up to 40% off Annual Plans for Clients
                      </p>
                    </div>
                  </div>

                  {/* Card 2: Rev-Share Model */}
                  <div
                    className="relative rounded-lg overflow-hidden w-full md:w-[258px] h-[120px] md:h-[151px] md:mt-[25px] stagger-item transition-all duration-300 hover:scale-105"
                    style={{ willChange: "transform" }}
                  >
                    {/* Background Mask Image */}
                    <div
                      className="absolute inset-0 pointer-events-none w-full h-full"
                      style={{
                        zIndex: 0,
                      }}
                    >
                      <Image
                        src="/Mask group.png"
                        alt=""
                        fill
                        className="object-cover"
                        unoptimized
                        style={{
                          objectFit: "cover",
                          width: "100%",
                          height: "100%",
                        }}
                      />
                    </div>

                    {/* Card Content */}
                    <div
                      className="relative bg-white rounded-lg p-3 md:p-6 flex flex-col items-start text-left"
                      style={{
                        border: "1px dashed #D1D5DB",
                        zIndex: 1,
                      }}
                    >
                      <Image
                        src="/coins.png"
                        alt="Coins"
                        width={24}
                        height={24}
                        className="object-contain mb-2 md:mb-4 w-5 h-5 md:w-6 md:h-6"
                        unoptimized
                      />
                      <p
                        className="text-xs md:text-sm"
                        style={{
                          fontFamily: "Poppins, sans-serif",
                          fontWeight: 500,
                          lineHeight: "140%",
                          color: "#111827",
                        }}
                      >
                        Rev-Share Model on Closed Deals
                      </p>
                    </div>
                  </div>

                  {/* Card 3: Enterprise Demo Account */}
                  <div
                    className="relative rounded-lg overflow-hidden w-full md:w-[258px] h-[120px] md:h-[151px] stagger-item transition-all duration-300 hover:scale-105"
                    style={{ willChange: "transform" }}
                  >
                    {/* Background Mask Image */}
                    <div
                      className="absolute inset-0 pointer-events-none w-full h-full"
                      style={{
                        zIndex: 0,
                      }}
                    >
                      <Image
                        src="/Mask group.png"
                        alt=""
                        fill
                        className="object-cover"
                        unoptimized
                        style={{
                          objectFit: "cover",
                          width: "100%",
                          height: "100%",
                        }}
                      />
                    </div>

                    {/* Card Content */}
                    <div
                      className="relative bg-white rounded-lg p-3 md:p-6 flex flex-col items-start text-left"
                      style={{
                        border: "1px dashed #D1D5DB",
                        zIndex: 1,
                      }}
                    >
                      <Image
                        src="/fingerprint-circled-lock.png"
                        alt="Fingerprint Lock"
                        width={24}
                        height={24}
                        className="object-contain mb-2 md:mb-4 w-5 h-5 md:w-6 md:h-6"
                        unoptimized
                      />
                      <p
                        className="text-xs md:text-sm"
                        style={{
                          fontFamily: "Poppins, sans-serif",
                          fontWeight: 500,
                          lineHeight: "140%",
                          color: "#111827",
                        }}
                      >
                        Access to a Enterprise - level Demo Account
                      </p>
                    </div>
                  </div>

                  {/* Card 4: Dedicated Support */}
                  <div
                    className="relative rounded-lg overflow-hidden w-full md:w-[258px] h-[120px] md:h-[151px] md:mt-[25px] stagger-item transition-all duration-300 hover:scale-105"
                    style={{ willChange: "transform" }}
                  >
                    {/* Background Mask Image */}
                    <div
                      className="absolute inset-0 pointer-events-none w-full h-full"
                      style={{
                        zIndex: 0,
                      }}
                    >
                      <Image
                        src="/Mask group.png"
                        alt=""
                        fill
                        className="object-cover"
                        unoptimized
                        style={{
                          objectFit: "cover",
                          width: "100%",
                          height: "100%",
                        }}
                      />
                    </div>

                    {/* Card Content */}
                    <div
                      className="relative bg-white rounded-lg p-3 md:p-6 flex flex-col items-start text-left"
                      style={{
                        border: "1px dashed #D1D5DB",
                        zIndex: 1,
                      }}
                    >
                      <Image
                        src="/headset-help.png"
                        alt="Headset Help"
                        width={24}
                        height={24}
                        className="object-contain mb-2 md:mb-4 w-5 h-5 md:w-6 md:h-6"
                        unoptimized
                      />
                      <p
                        className="text-xs md:text-sm"
                        style={{
                          fontFamily: "Poppins, sans-serif",
                          fontWeight: 500,
                          lineHeight: "140%",
                          color: "#111827",
                        }}
                      >
                        Dedicated Support and Co-Selling
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Partner Stories Section */}
        <section id="video-walkthrough" className="w-full px-4 md:px-8 lg:px-12 pt-12 md:pt-16 lg:pt-20 pb-16 md:pb-20 lg:pb-24 fade-in-section" style={{ backgroundColor: "#F9FAFB", transform: "translateZ(0)", willChange: "transform" }}>
          <div className="max-w-[1200px] mx-auto">
            <div className="text-left mb-12 space-y-2">
              <h2 className="text-3xl md:text-4xl font-semibold text-[#161d26]" style={{ fontFamily: "Poppins" }}>From Build to Scale</h2>
              <p className="text-sm md:text-base text-[#4b5563]">
                Partner stories across the entire AI product lifecycle.
              </p>
            </div>
            <div className="flex flex-col lg:flex-row items-stretch gap-4">
              {/* Left small card (swapped to Veehive) */}
              <div
                className="w-[220px] min-w-[220px] min-h-[320px] flex-none rounded-2xl text-white relative overflow-hidden flex flex-col"
                style={{
                  backgroundImage: `url(${veehivePortrait.src})`,
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
                      <div>Sathish Jeyakumar</div>
                      <div className="opacity-80 text-xs">CEO - Veehive</div>
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
                        backgroundImage: `url(${leftCardPortrait.src})`,
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
                            <div>V S Hariharan</div>
                            <div className="opacity-80 text-xs">MD & Group CEO - Redington</div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex-1 pl-3 pr-3 md:pl-4 md:pr-4">
                      <div className="mb-4">
                        <img
                          src="/redington-logo.png"
                          alt="Redington logo"
                          className="h-8 w-auto object-contain"
                          loading="lazy"
                        />
                      </div>
                      <p className="text-[#111] text-base leading-relaxed mb-4">
                        Tangram AI enables partners to bring enterprise-grade AI solutions to market faster and at scale. Its agent-first, enterprise-ready platform makes it a compelling addition to any reseller’s portfolio, delivering the right balance of innovation, reliability, and commercial value.
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
                <h2 className="text-3xl md:text-4xl font-semibold text-[#161d26]" style={{ fontFamily: "Poppins" }}>FAQ</h2>
                <div className="flex flex-wrap gap-3">
                  {Array.from(new Set(faqEntries.map((e) => e.section))).map((section) => (
                    <button
                      key={section}
                      onClick={() => {
                        setFaqFilter(section)
                        setExpandedFAQ(null)
                      }}
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
                    const open = expandedFAQ === idx
                    return (
                      <div key={item.q}>
                        <button
                          onClick={() => setExpandedFAQ(open ? null : idx)}
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
          </div>
        </section>
      </div>
      {/* End of content wrapper */}
    </div>
  )
}
