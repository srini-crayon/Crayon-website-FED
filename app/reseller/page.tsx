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

        {/* Secure control section */}
        <section className="w-full px-8 md:px-12 lg:px-16 py-12 md:py-20 lg:py-24 fade-in-section" style={{ position: "relative", overflow: "hidden", background: "linear-gradient(135deg, #f7f9ff 0%, #eef2ff 45%, #ffffff 100%)" }}>
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              inset: 0,
              background: "radial-gradient(80% 50% at 80% 20%, rgba(138, 180, 255, 0.35), transparent)",
              opacity: 1,
            }}
          />
          <div className="relative max-w-[1200px] mx-auto flex flex-col lg:flex-row items-start gap-10 md:gap-12">
            <div className="flex-1 flex flex-col gap-6 text-left">
              <div>
                <div className="space-y-2">
                  <h2
                    className="text-3xl md:text-4xl font-semibold text-[#161d26]"
                    style={{ fontFamily: "Poppins", lineHeight: "normal" }}
                  >
                    Why Resell Tangram AI
                  </h2>
                  <p className="text-sm md:text-base text-[#0f172a] font-medium max-w-[720px]" style={{ fontFamily: "Poppins", lineHeight: "24px" }}>
                    A Reseller-First AI Program Built for Predictable Revenue
                  </p>
                </div>
              </div>
              <p
                className="text-sm md:text-base text-[#4b5563] max-w-[720px]"
                style={{ fontFamily: "Poppins", lineHeight: "24px" }}
              >
                Tangram AI enables resellers to add enterprise AI offerings to their catalog without the risk, cost, or complexity of developing AI solutions in‑house. The platform provides a ready‑to‑sell portfolio of AI agents that address real business problems and can be positioned directly within existing customer relationships.
                <br /><br />
                As a reseller, you focus on sales, account management, and expansion, while Tangram AI provides the platform, agents, and ongoing product enhancements.
              </p>
            </div>

            <div className="flex-1 w-full lg:max-w-[520px] mx-auto">
              <div className="relative rounded border border-[#e2e8f0] bg-white overflow-hidden" style={{ height: "320px" }}>
                <img
                  src="/reseller-network.png"
                  alt="Reseller network illustration"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

          </div>
 
          <div className="mt-8 max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-4 gap-4 text-[#0f172a] divide-y divide-[#e5e7eb] md:divide-y-0 md:divide-x md:divide-[#e5e7eb]">
            <div className="p-3 rounded">
              <div className="mb-2 text-[#5a67d8]">
                <TrendingUp className="w-5 h-5" aria-hidden="true" />
              </div>
              <p className="text-base text-[#0f172a]" style={{ fontFamily: "Poppins", lineHeight: "22px" }}>
                A Reseller-First AI Program Built for Predictable Revenue.
              </p>
            </div>
            <div className="p-3 rounded md:pl-4">
              <div className="mb-2 text-[#16a34a]">
                <Globe className="w-5 h-5" aria-hidden="true" />
              </div>
              <p className="text-base text-[#0f172a]" style={{ fontFamily: "Poppins", lineHeight: "22px" }}>
                Faster sales cycles compared to custom AI development.
              </p>
            </div>
            <div className="p-3 rounded md:pl-4">
              <div className="mb-2 text-[#f59e0b]">
                <Target className="w-5 h-5" aria-hidden="true" />
              </div>
              <p className="text-base text-[#0f172a]" style={{ fontFamily: "Poppins", lineHeight: "22px" }}>
                No AI infrastructure, model training, or maintenance required.
              </p>
            </div>
            <div className="p-3 rounded md:pl-4">
              <div className="mb-2 text-[#ef4444]">
                <Play className="w-5 h-5" aria-hidden="true" />
              </div>
              <p className="text-base text-[#0f172a]" style={{ fontFamily: "Poppins", lineHeight: "22px" }}>
                Clear commercial structure with recurring subscription revenue.
              </p>
            </div>
          </div>
        </section>

        {/* Why Resellers Choose Tangram Section */}
        <section className="w-full px-8 md:px-12 lg:px-16 pt-10 md:pt-14 lg:pt-18 pb-12 md:pb-16 lg:pb-20 bg-white fade-in-section" style={{ transform: "translateZ(0)", willChange: "transform" }}>
          <div className="max-w-[1200px] mx-auto flex flex-col gap-10 md:gap-12">
            <div className="text-center flex flex-col gap-3 items-center -mt-4">
              <h2
                className="fade-in-blur text-3xl md:text-4xl font-semibold text-[#161d26]"
                style={{
                  textAlign: "center",
                  fontFamily: "Poppins",
                  width: "780px",
                  willChange: "opacity, transform, filter",
                }}
              >
                Designed for Technology Resellers Serving Mid-Market and Enterprise Customers
              </h2>
              <p
                className="fade-in-section text-sm md:text-base text-[#4b5563] text-center max-w-[780px] mx-auto"
                style={{ willChange: "opacity, transform", width: "780px" }}
              >
                Designed for organizations that already sell technology or services and want to add AI solutions with minimal operational change.
              </p>
            </div>

            <div className="relative">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                <div className="rounded-[4px] border border-gray-200 bg-white p-6">
                  <div className="mb-4 text-[#0f766e]">
                    <Target className="w-6 h-6" aria-hidden="true" />
                  </div>
                  <h3
                    className="fade-in-blur transition-all duration-300 mb-3"
                    style={{
                      color: "#181818",
                      fontFamily: "Poppins",
                      fontSize: "clamp(15px, 3.5vw, 18px)",
                      fontStyle: "normal",
                      fontWeight: 500,
                      lineHeight: "150%",
                      letterSpacing: "-0.4px",
                      willChange: "opacity, transform, filter",
                    }}
                  >
                    Consulting Firms &amp; SIs
                  </h3>
                  <p
                    className="fade-in-section"
                    style={{
                      color: "#1f2937",
                      fontFamily: "Poppins",
                      fontSize: "clamp(14px, 3.5vw, 16px)",
                      fontStyle: "normal",
                      fontWeight: 400,
                      lineHeight: "150%",
                      letterSpacing: "-0.4px",
                    }}
                  >
                    Add enterprise AI to transformation programs and increase deal value.
                  </p>
                </div>

                <div className="rounded-[4px] border border-gray-200 bg-white p-6">
                  <div className="mb-4 text-[#2563eb]">
                    <Globe className="w-6 h-6" aria-hidden="true" />
                  </div>
                  <h3
                    className="fade-in-blur transition-all duration-300 mb-3"
                    style={{
                      color: "#181818",
                      fontFamily: "Poppins",
                      fontSize: "clamp(16px, 4vw, 20px)",
                      fontStyle: "normal",
                      fontWeight: 500,
                      lineHeight: "150%",
                      letterSpacing: "-0.4px",
                      willChange: "opacity, transform, filter",
                    }}
                  >
                    IT Resellers &amp; MSPs
                  </h3>
                  <p
                    className="fade-in-section"
                    style={{
                      color: "#4b5563",
                      fontFamily: "Poppins",
                      fontSize: "clamp(14px, 3.5vw, 16px)",
                      fontStyle: "normal",
                      fontWeight: 400,
                      lineHeight: "150%",
                      letterSpacing: "-0.4px",
                    }}
                  >
                    Expand portfolios with AI automation that drives retention.
                  </p>
                </div>

                <div className="rounded-[4px] border border-gray-200 bg-white p-6">
                  <div className="mb-4 text-[#f97316]">
                    <TrendingUp className="w-6 h-6" aria-hidden="true" />
                  </div>
                  <h3
                    className="fade-in-blur transition-all duration-300 mb-3"
                    style={{
                      color: "#181818",
                      fontFamily: "Poppins",
                      fontSize: "clamp(15px, 3.5vw, 18px)",
                      fontStyle: "normal",
                      fontWeight: 500,
                      lineHeight: "150%",
                      letterSpacing: "-0.4px",
                      whiteSpace: "nowrap",
                      willChange: "opacity, transform, filter",
                    }}
                  >
                    Digital &amp; Tech Agencies
                  </h3>
                  <p
                    className="fade-in-section"
                    style={{
                      color: "#4b5563",
                      fontFamily: "Poppins",
                      fontSize: "clamp(14px, 3.5vw, 16px)",
                      fontStyle: "normal",
                      fontWeight: 400,
                      lineHeight: "150%",
                      letterSpacing: "-0.4px",
                    }}
                  >
                    Deliver AI-powered CX, personalization, and analytics.
                  </p>
                </div>

                <div className="rounded-[4px] border border-gray-200 bg-white p-6">
                  <div className="mb-4 text-[#7c3aed]">
                    <Plus className="w-6 h-6" aria-hidden="true" />
                  </div>
                  <h3
                    className="fade-in-blur transition-all duration-300 mb-3"
                    style={{
                      color: "#181818",
                      fontFamily: "Poppins",
                      fontSize: "clamp(16px, 4vw, 20px)",
                      fontStyle: "normal",
                      fontWeight: 500,
                      lineHeight: "150%",
                      letterSpacing: "-0.4px",
                      willChange: "opacity, transform, filter",
                    }}
                  >
                    ISVs &amp; SaaS Vendors
                  </h3>
                  <p
                    className="fade-in-section"
                    style={{
                      color: "#4b5563",
                      fontFamily: "Poppins",
                      fontSize: "clamp(14px, 3.5vw, 16px)",
                      fontStyle: "normal",
                      fontWeight: 400,
                      lineHeight: "150%",
                      letterSpacing: "-0.4px",
                    }}
                  >
                    ISVs &amp; SaaS Vendors – Resell or bundle AI agents to enhance product value and differentiation.
                  </p>
                </div>
              </div>

              {/* Connecting Lines Image */}
              <div className="flex justify-center pt-0">
                <img
                  src="/lines-connector.png"
                  alt="Connecting lines"
                  className="max-w-[620px] w-full h-auto pointer-events-none select-none"
                />
              </div>

              {/* Build With Us CTA */}
              <div className="flex flex-col items-center text-center gap-3 pt-0">
                <h3
                  className="fade-in-blur"
                  style={{
                    fontFamily: "Poppins",
                    fontSize: "24px",
                    fontWeight: 600,
                    color: "#0E1116",
                  }}
                >
                How the Reseller Program Works
                </h3>
                <p
                  className="fade-in-section text-sm md:text-base text-[#4b5563] text-center max-w-[780px] mx-auto"
                  style={{
                    lineHeight: "24px",
                    marginBottom: "12px",
                    willChange: "opacity, transform",
                  }}
                >
                A simple, structured reseller journey with onboarding, enablement, and on-demand resources to help resellers sell Tangram AI effectively.
                </p>
                <div className="w-full max-w-[720px] mt-2">
                  <img
                    src="/isv-video.png"
                    alt="Start ISV onboarding video"
                    className="w-full h-auto rounded-[12px] shadow-sm"
                  />
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
                  className="mb-6 text-3xl md:text-4xl font-semibold text-[#161d26] fade-in-blur"
                  style={{
                    fontFamily: "Poppins",
                  }}
                >
                  Our Reseller Benefits
                </h2>
                <p
                  className="fade-in-section text-sm md:text-base text-[#4b5563] max-w-[720px]"
                  style={{
                    fontFamily: "Poppins",
                    lineHeight: "150%",
                  }}
                >
                  The Tangram AI Reseller Program is designed to help partners scale revenue faster by reselling enterprise-ready AI solutions without the cost or complexity of building AI products in-house. As a Tangram AI reseller, you gain access to a proven AI portfolio, strong commercial incentives, and full sales support to win and grow enterprise accounts.
                </p>
              </div>

              {/* Right side - Benefits cards */}
              <div className="flex-1 md:w-1/2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    {
                      title: "Recurring Partner Revenue",
                      description: "Build predictable, subscription-based income streams from long-term enterprise AI deployments.",
                      iconSrc: "/percentage-round.png",
                    },
                    {
                      title: "Attractive Reseller Margins",
                      description: "Benefit from reseller-only pricing and competitive commercial incentives that protect profitability.",
                      iconSrc: "/coins.png",
                    },
                    {
                      title: "Faster Deal Closure",
                      description: "Shorten sales cycles with production-ready AI agents, proven use cases, and live demos.",
                      icon: <TrendingUp className="w-5 h-5 md:w-6 md:h-6 text-[#111827]" aria-hidden="true" />,
                    },
                    {
                      title: "Co-Selling & Deal Support",
                      description: "Win larger opportunities with joint selling, pre-sales assistance, and enterprise deal execution support.",
                      iconSrc: "/headset-help.png",
                    },
                    {
                      title: "Enterprise-Grade AI Portfolio",
                      description: "Offer secure, scalable, and compliant AI solutions trusted by enterprise customers.",
                      iconSrc: "/fingerprint-circled-lock.png",
                    },
                    {
                      title: "Multi-Industry Revenue Opportunities",
                      description: "Sell AI solutions across BFSI, Retail, Travel, Telecom, Healthcare, and SaaS industries.",
                      icon: <Globe className="w-5 h-5 md:w-6 md:h-6 text-[#111827]" aria-hidden="true" />,
                    },
                  ].map((item, idx) => (
                    <div
                      key={item.title}
                      className="relative rounded-lg overflow-hidden w-full h-full min-h-[151px] stagger-item transition-all duration-300 hover:scale-105"
                      style={{ willChange: "transform" }}
                    >
                      {/* Background Mask Image */}
                      <div
                        className="absolute inset-0 pointer-events-none w-full h-full"
                        style={{ zIndex: 0 }}
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
                        <div className="flex items-center justify-center mb-2 md:mb-4 w-5 h-5 md:w-6 md:h-6 text-[#111827]">
                          {item.iconSrc ? (
                            <Image
                              src={item.iconSrc}
                              alt={item.title}
                              width={24}
                              height={24}
                              className="object-contain w-5 h-5 md:w-6 md:h-6"
                              unoptimized
                            />
                          ) : (
                            item.icon
                          )}
                        </div>
                        <h3
                          className="text-xs md:text-sm font-semibold text-[#111827]"
                          style={{ fontFamily: "Poppins" }}
                        >
                          {item.title}
                        </h3>
                        <p
                          className="text-xs md:text-sm mt-2"
                          style={{
                            fontFamily: "Poppins, sans-serif",
                            fontWeight: 400,
                            lineHeight: "140%",
                            color: "#111827",
                          }}
                        >
                          {item.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Partner Stories Section */}
        <section id="video-walkthrough" className="w-full px-4 md:px-8 lg:px-12 pt-12 md:pt-16 lg:pt-20 pb-16 md:pb-20 lg:pb-24 fade-in-section" style={{ backgroundColor: "#F9FAFB", transform: "translateZ(0)", willChange: "transform" }}>
          <div className="max-w-[1200px] mx-auto">
            <div className="text-left mb-12 space-y-2">
              <h2 className="text-3xl md:text-4xl font-semibold text-[#161d26]" style={{ fontFamily: "Poppins" }}>Partner Experience</h2>
              <p className="text-sm md:text-base text-[#4b5563] max-w-[720px]">
                Enterprise Consulting Partner leveraged Tangram AI to introduce enterprise AI offerings across multiple client engagements, accelerating deal velocity and expanding service scope.
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
