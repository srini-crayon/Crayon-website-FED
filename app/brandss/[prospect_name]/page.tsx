"use client"

import Image from "next/image"
import React, { useState, useEffect, useRef, useMemo } from "react"
import type { ReactNode } from "react"
import { useParams } from "next/navigation"
import { brandsService } from "../../../lib/api/brands.service"
import type {
  MegaTrend,
  Opportunity,
  ParsedOpportunity,
  Prospect,
  SpotlightAgent as ApiSpotlightAgent,
  AgentDetail
} from "../../../lib/types/brands.types"

// MegaTrends Component
interface Trend {
  index: string
  tag: string
  title: string
  shiftTitle: string
  shiftBody: string
  extraLabel: string
  extraBody: string
  accentColor: string
}

const defaultTrends: Trend[] = [
  {
    index: "01",
    tag: "Consumer",
    title: "Zebra Striping",
    shiftTitle: "THE SHIFT",
    shiftBody: "Consumers are no longer strictly 'drinkers' or 'non-drinkers'... switching between full-strength and 0.0% options within the same night.",
    extraLabel: "THE PARADOX",
    extraBody: "Total volume may be flat/down, but 'Value per Liter' is rising due to premiumisation.",
    accentColor: "pink",
  },
  {
    index: "02",
    tag: "Technology",
    title: "CO-Pilots to Agents",
    shiftTitle: "THE SHIFT",
    shiftBody: "The 'iron curtain' between distributors and retailers is crumbling. Bar owners now demand the same hyper-personalized experience they get as consumers on Amazon.",
    extraLabel: "THE CIO VIEW",
    extraBody: "Budget is moving from 'Knowledge Management' to 'Action Management' (booking stock, reconciling invoices).",
    accentColor: "blue",
  },
  {
    index: "03",
    tag: "Channel",
    title: "B2b2c Convergence",
    shiftTitle: "THE SHIFT",
    shiftBody: "The 'Iron Curtain' between distributors and retailers is crumbling. Bar owners now demand the same hyper-personalized experience they get as consumers on Amazon.",
    extraLabel: "THE CIO VIEW",
    extraBody: "Most FMCG B2B portals are currently just glorified Excel sheets.",
    accentColor: "orange",
  },
  {
    index: "04",
    tag: "Operational",
    title: "From Asset - Heave to Data-rich",
    shiftTitle: "THE SHIFT",
    shiftBody: "The 'Iron Curtain' between distributors and retailers is crumbling. Bar owners now demand the same hyper-personalized experience they get as consumers on Amazon.",
    extraLabel: "THE CIO VIEW",
    extraBody: "Most FMCG B2B portals are currently just glorified Excel sheets.",
    accentColor: "teal",
  },
]

function MegaTrends({ trends = defaultTrends, categoryDescription }: { trends?: Trend[], categoryDescription?: string }) {
  const getAccentColorClasses = (color: string) => {
    switch (color) {
      case "pink":
        return {
          numberGradient: "linear-gradient(0deg, rgba(240, 82, 131, 0) 0%, #F05283 100%)",
          tag: "bg-pink-100 text-pink-700 hover:bg-pink-200",
        }
      case "blue":
        return {
          numberGradient: "linear-gradient(0deg, rgba(0, 129, 197, 0) 0%, #0081C5 100%)",
          tag: "bg-cyan-100 text-cyan-700 hover:bg-cyan-200",
        }
      case "orange":
        return {
          numberGradient: "linear-gradient(0deg, rgba(245, 137, 31, 0) 0%, #F5891F 100%)",
          tag: "bg-orange-100 text-orange-700 hover:bg-orange-200",
        }
      case "teal":
        return {
          numberGradient: "linear-gradient(0deg, rgba(4, 171, 139, 0) 0%, #04AB8B 100%)",
          tag: "bg-teal-100 text-teal-700 hover:bg-teal-200",
        }
      default:
        return {
          numberGradient: "linear-gradient(0deg, rgba(0, 0, 0, 0) 0%, #000000 100%)",
          tag: "bg-gray-100 text-gray-700 hover:bg-gray-200",
        }
    }
  }

  return (
    <section
      className="w-full py-16 px-8 md:px-20 lg:px-20 bg-white relative overflow-hidden"
      style={{
        minHeight: "650px",
      }}
      aria-label="Mega Trends section"
    >
      <div className="max-w-7xl mx-auto relative" style={{ zIndex: 1 }}>
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2
            style={{
              fontFamily: "Poppins, sans-serif",
              fontWeight: 600,
              fontStyle: "normal",
              fontSize: "28px",
              lineHeight: "33.6px",
              letterSpacing: "-0.56px",
              textAlign: "center",
              verticalAlign: "middle",
              background: "linear-gradient(270deg, #FF9231 0%, #F05283 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              marginBottom: "4px",
            }}
          >
            Mega Trends
          </h2>
          <p
            style={{
              fontFamily: "Poppins, sans-serif",
              fontWeight: 500,
              fontStyle: "normal",
              fontSize: "16px",
              lineHeight: "24px",
              letterSpacing: "0%",
              textAlign: "center",
              verticalAlign: "middle",
              color: "#111827",
            }}
          >
            {categoryDescription || "Four converging forces reshaping the beverage industry landscape"}
          </p>
        </div>

        {/* Cards Grid - Aligned with hero section boundaries */}
        <div
          className="grid grid-cols-1 md:grid-cols-2 lg:flex lg:justify-between gap-6 md:gap-8"
          role="list"
          aria-label="Mega trends cards"
        >
          {trends.map((trend, idx) => {
            const colors = getAccentColorClasses(trend.accentColor)
            return (
              <div
                key={idx}
                role="listitem"
                className="bg-white card-hover flex-shrink-0 cursor-pointer"
                style={{
                  fontFamily: "Poppins, sans-serif",
                  width: "290px",
                  height: "auto",
                  borderRadius: "24px",
                  border: "1px solid #E4E4E7",
                  padding: "28px 36px",
                  maxWidth: "100%",
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-8px)"
                  e.currentTarget.style.boxShadow = "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
                  e.currentTarget.style.borderColor = "#D1D5DB"
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)"
                  e.currentTarget.style.boxShadow = "none"
                  e.currentTarget.style.borderColor = "#E4E4E7"
                }}
              >
                {/* Card Header - Number and Tag */}
                <div className="flex justify-between items-start mb-6">
                  {/* Large Index Number - Logo Image */}
                  <Image
                    src={`/Mega_trend_${trend.index}.png`}
                    alt={`Mega Trend ${trend.index}`}
                    width={57}
                    height={64}
                    style={{
                      width: "57px",
                      height: "64px",
                      objectFit: "contain",
                    }}
                  />
                  {/* Pill Tag */}
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${colors.tag} transition-colors`}
                    style={{
                      fontFamily: "Poppins, sans-serif",
                    }}
                  >
                    {trend.tag}
                  </span>
                </div>

                {/* Card Title */}
                <div
                  style={{
                    minHeight: "45px",
                    marginBottom: "12px",
                    display: "flex",
                    alignItems: "flex-start",
                  }}
                >
                  <h3
                    style={{
                      fontFamily: "Poppins, sans-serif",
                      fontWeight: 600,
                      fontStyle: "normal",
                      fontSize: "21px",
                      lineHeight: "120%",
                      letterSpacing: "0%",
                      color: "#111827",
                      margin: 0,
                    }}
                  >
                    {trend.title}
                  </h3>
                </div>

                {/* THE SHIFT Section */}
                <div className="mb-5">
                  <p
                    style={{
                      fontFamily: "Poppins, sans-serif",
                      fontWeight: 600,
                      fontStyle: "normal",
                      fontSize: "14px",
                      lineHeight: "21px",
                      letterSpacing: "0%",
                      verticalAlign: "middle",
                      color: "#111827",
                      textTransform: "uppercase",
                      marginBottom: "8px",
                    }}
                  >
                    {trend.shiftTitle}
                  </p>
                  <p
                    style={{
                      fontFamily: "Poppins, sans-serif",
                      fontWeight: 400,
                      fontStyle: "normal",
                      fontSize: "14px",
                      lineHeight: "21px",
                      letterSpacing: "0%",
                      color: "#4B5563",
                    }}
                  >
                    {trend.shiftBody}
                  </p>
                </div>

                {/* Extra Section (THE PARADOX or THE CIO VIEW) */}
                <div>
                  <p
                    style={{
                      fontFamily: "Poppins, sans-serif",
                      fontWeight: 600,
                      fontStyle: "normal",
                      fontSize: "14px",
                      lineHeight: "21px",
                      letterSpacing: "0%",
                      verticalAlign: "middle",
                      color: "#111827",
                      textTransform: "uppercase",
                      marginBottom: "8px",
                    }}
                  >
                    {trend.extraLabel}
                  </p>
                  <p
                    style={{
                      fontFamily: "Poppins, sans-serif",
                      fontWeight: 400,
                      fontStyle: "normal",
                      fontSize: "14px",
                      lineHeight: "21px",
                      letterSpacing: "0%",
                      color: "#4B5563",
                    }}
                  >
                    {trend.extraBody}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Bottom Right Image - Positioned at extreme right bottom corner */}
      <div className="hidden lg:block absolute right-0 bottom-0" style={{ zIndex: -1 }}>
        <div className="relative h-auto">
          <Image
            src="/Mega_trend_outer.png"
            alt="Mega Trends Illustration"
            width={600}
            height={342}
            className="object-contain h-auto max-h-[343px] md:max-h-[343px]"
            style={{ width: "auto", height: "auto", display: "block" }}
            priority
          />
        </div>
      </div>

      {/* Bottom Right Image - Mobile/Tablet view */}
      <div className="lg:hidden w-full flex items-center justify-center mt-8">
        <div className="relative h-auto">
          <Image
            src="/Mega_trend_outer.png"
            alt="Mega Trends Illustration"
            width={600}
            height={342}
            className="object-contain h-auto max-h-[480px] md:max-h-[520px]"
            style={{ width: "auto", height: "auto", display: "block" }}
            priority
          />
        </div>
      </div>
    </section>
  )
}

// Scroll Animation Hook
function useScrollAnimation() {
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -100px 0px" }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current)
      }
    }
  }, [])

  return { ref, isVisible }
}

// Animated Section Component
function AnimatedSection({ children, delay = 0 }: { children: ReactNode; delay?: number }) {
  const { ref, isVisible } = useScrollAnimation()

  return (
    <div
      ref={ref}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "translateY(0)" : "translateY(30px)",
        transition: `opacity 0.6s ease-out ${delay}s, transform 0.6s ease-out ${delay}s`,
      }}
    >
      {children}
    </div>
  )
}

export default function BrandssPage() {
  const params = useParams()
  // Get prospect_name from URL: /brandss/Heineken
  const prospectNameParam = (params?.prospect_name as string) || ''

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [prospect, setProspect] = useState<Prospect | null>(null)
  const [megaTrends, setMegaTrends] = useState<MegaTrend[]>([])
  const [megaTrendsDescription, setMegaTrendsDescription] = useState<string>("")
  const [opportunities, setOpportunities] = useState<ParsedOpportunity[]>([])
  const [opportunitiesDescription, setOpportunitiesDescription] = useState<string>("")
  const [spotlightAgents, setSpotlightAgents] = useState<ApiSpotlightAgent[]>([])
  const [spotlightAgentsDescription, setSpotlightAgentsDescription] = useState<string>("")

  // Parse opportunity description into structured data
  const parseOpportunityDescription = (description: string): {
    opportunity?: string
    solution?: string[]
    impact?: string
    validation?: string
  } => {
    const parsed: {
      opportunity?: string
      solution?: string[]
      impact?: string
      validation?: string
    } = {}

    const lines = description.split('\n').map(line => line.trim()).filter(line => line.length > 0)

    let currentSection: 'opportunity' | 'solution' | 'impact' | 'validation' | null = null
    let currentContent: string[] = []

    lines.forEach((line) => {
      if (line.toLowerCase().startsWith('opportunity:')) {
        if (currentSection && currentContent.length > 0) {
          if (currentSection === 'solution') {
            parsed.solution = currentContent
          } else {
            parsed[currentSection] = currentContent.join(' ')
          }
        }
        currentSection = 'opportunity'
        currentContent = [line.replace(/^opportunity:\s*/i, '').replace(/^•\s*/, '')]
      } else if (line.toLowerCase().startsWith('solution:')) {
        if (currentSection && currentContent.length > 0) {
          if (currentSection === 'solution') {
            parsed.solution = currentContent
          } else {
            parsed[currentSection] = currentContent.join(' ')
          }
        }
        currentSection = 'solution'
        currentContent = [line.replace(/^solution:\s*/i, '').replace(/^•\s*/, '')]
      } else if (line.toLowerCase().startsWith('business impact:')) {
        if (currentSection && currentContent.length > 0) {
          if (currentSection === 'solution') {
            parsed.solution = currentContent
          } else {
            parsed[currentSection] = currentContent.join(' ')
          }
        }
        currentSection = 'impact'
        currentContent = [line.replace(/^business impact:\s*/i, '').replace(/^•\s*/, '')]
      } else if (line.toLowerCase().startsWith('market validation:')) {
        if (currentSection && currentContent.length > 0) {
          if (currentSection === 'solution') {
            parsed.solution = currentContent
          } else {
            parsed[currentSection] = currentContent.join(' ')
          }
        }
        currentSection = 'validation'
        currentContent = [line.replace(/^market validation:\s*/i, '').replace(/^•\s*/, '')]
      } else if (currentSection) {
        const cleaned = line.replace(/^•\s*/, '')
        if (currentSection === 'solution') {
          currentContent.push(cleaned)
        } else {
          currentContent.push(cleaned)
        }
      }
    })

    if (currentSection && currentContent.length > 0) {
      if (currentSection === 'solution') {
        parsed.solution = currentContent
      } else if (currentSection === 'opportunity') {
        parsed.opportunity = currentContent.join(' ')
      } else if (currentSection === 'impact') {
        parsed.impact = currentContent.join(' ')
      } else if (currentSection === 'validation') {
        parsed.validation = currentContent.join(' ')
      }
    }

    return parsed
  }

  // Map API mega trends to UI format
  const mapMegaTrendsToUI = (apiTrends: MegaTrend[]): Trend[] => {
    const tagToColor: { [key: string]: string } = {
      'Consumer': 'pink',
      'Technology': 'blue',
      'The Channel': 'orange',
      'Channel': 'orange',
      'Operational': 'teal',
    }

    const parseDescription = (description: string, tag: string) => {
      const lines = description.split('\n')
      let shift = ""
      let secondPart = ""
      let label = "THE PARADOX"

      lines.forEach((line) => {
        if (line.startsWith("The Shift:")) {
          shift = line.replace("The Shift:", "").trim()
        } else if (line.startsWith("The Paradox:")) {
          secondPart = line.replace("The Paradox:", "").trim()
          label = "THE PARADOX"
        } else if (line.startsWith("The CIO View:")) {
          secondPart = line.replace("The CIO View:", "").trim()
          label = "THE CIO VIEW"
        } else if (line.startsWith("The Gap:")) {
          secondPart = line.replace("The Gap:", "").trim()
          label = "THE GAP"
        } else if (line.startsWith("The Opportunity:")) {
          secondPart = line.replace("The Opportunity:", "").trim()
          label = "THE OPPORTUNITY"
        }
      })

      return { shift, secondPart, label }
    }

    return apiTrends.map((trend, index) => {
      const { shift, secondPart, label } = parseDescription(trend.description, trend.tag)
      const indexStr = String(index + 1).padStart(2, '0')
      const accentColor = tagToColor[trend.tag] || 'pink'

      return {
        index: indexStr,
        tag: trend.tag,
        title: trend.title,
        shiftTitle: "THE SHIFT",
        shiftBody: shift,
        extraLabel: label,
        extraBody: secondPart,
        accentColor,
      }
    })
  }

  // Fetch all data
  useEffect(() => {
    const fetchData = async () => {
      // Decode and normalize the prospect name from URL
      const normalizedProspectName = prospectNameParam
        ? decodeURIComponent(prospectNameParam).trim()
        : ''

      if (!normalizedProspectName) {
        setError("Prospect name is required in the URL (e.g., /brandss/Heineken)")
        setLoading(false)
        return
      }

      console.log("BrandssPage: Fetching data for prospect:", normalizedProspectName)

      try {
        setLoading(true)
        setError(null)

        const prospectData = await brandsService.getProspectByName(normalizedProspectName)

        if (!prospectData) {
          setError(`Prospect "${normalizedProspectName}" not found. Please check the URL.`)
          setLoading(false)
          return
        }

        setProspect(prospectData)
        const prospectId = prospectData.prospect_id

        const [megaTrendsRes, opportunitiesRes, spotlightAgentsRes] = await Promise.all([
          brandsService.fetchMegaTrends(prospectId),
          brandsService.fetchOpportunities(prospectId),
          brandsService.fetchSpotlightAgents(prospectId),
        ])

        console.log("BrandssPage: API Responses -", {
          megaTrends: megaTrendsRes.success ? `${megaTrendsRes.data.length} trends` : "failed",
          opportunities: opportunitiesRes.success ? `${opportunitiesRes.data.length} opportunities` : "failed",
          spotlightAgents: spotlightAgentsRes.success ? `${spotlightAgentsRes.data.length} agents` : "failed"
        });

        if (megaTrendsRes.success && megaTrendsRes.data.length > 0) {
          setMegaTrends(megaTrendsRes.data)
          setMegaTrendsDescription(megaTrendsRes.data[0].category_description || "")
        }

        if (opportunitiesRes.success && opportunitiesRes.data.length > 0) {
          const parsedOpportunities: ParsedOpportunity[] = opportunitiesRes.data.map((opp) => ({
            ...opp,
            parsed: parseOpportunityDescription(opp.description),
          }))
          setOpportunities(parsedOpportunities)
          setOpportunitiesDescription(opportunitiesRes.data[0].category_description || "")
        }

        if (spotlightAgentsRes.success && spotlightAgentsRes.data.length > 0) {
          console.log("BrandssPage: Spotlight agents fetched successfully:", spotlightAgentsRes.data.length, "agents");
          console.log("BrandssPage: Spotlight agents data:", spotlightAgentsRes.data);
          setSpotlightAgents(spotlightAgentsRes.data)
          setSpotlightAgentsDescription(spotlightAgentsRes.data[0].category_description || "")
        } else {
          console.warn("BrandssPage: No spotlight agents found. Response:", spotlightAgentsRes);
        }

      } catch (err: any) {
        console.error("Error fetching brand data:", err)
        setError(err.message || "Failed to load brand data")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [prospectNameParam])

  // Convert API trends to UI format - only use API data, no fallback
  const uiTrends = useMemo(() => {
    if (megaTrends.length > 0) {
      return mapMegaTrendsToUI(megaTrends)
    }
    return [] // Return empty array if no API data - section will be hidden
  }, [megaTrends])

  const brandName = prospect?.prospect_name || "Heineken"
  const brandTheme = prospect?.theme || "AI Growth Opportunities"
  const brandSubtitle = prospect?.["theme description"] || `Strategic proposal for ${brandName} APAC`

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-300 border-t-blue-600 mb-4"></div>
        <p className="text-gray-600 text-lg">Loading brand data...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center max-w-md">
          <h1 className="text-3xl font-bold mb-4 text-red-600">Error</h1>
          <p className="text-gray-600 mb-6">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <style jsx global>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .fade-in-up {
          animation: fadeInUp 0.6s ease-out forwards;
        }

        .fade-in {
          animation: fadeIn 0.8s ease-out forwards;
        }

        .scale-in {
          animation: scaleIn 0.5s ease-out forwards;
        }

        .card-hover {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .card-hover:hover {
          transform: translateY(-8px);
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
        }

        .button-hover {
          transition: all 0.2s ease;
        }

        .button-hover:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
        }

        .image-hover {
          transition: transform 0.3s ease, filter 0.3s ease;
        }

        .image-hover:hover {
          transform: scale(1.05);
        }
      `}</style>
      {/* Hero Section */}
      <section
        className="w-full py-20 px-8 md:px-20 lg:px-20"
        style={{
          background: "radial-gradient(100% 100% at 50% 0%, #DDFFED 0%, #FFFFFF 100%)",
          minHeight: "360px",
        }}
      >
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-16">
            {/* Left Side - Content */}
            <div className="flex-1 flex flex-col justify-center space-y-6 lg:space-y-8">
              {/* Logos Section - Crayon and Heineken */}
              <div
                className="flex items-center gap-4 mb-4"
                style={{
                  width: "913px",
                  maxWidth: "100%",
                }}
              >
                <Image
                  src="/img/crayondata-20logo.png"
                  alt="Crayon Data"
                  width={120}
                  height={40}
                  className="h-10 w-auto"
                  priority
                />
                <div className="h-8 w-px bg-gray-300" />
                {prospect?.prospect_logo ? (
                  <Image
                    src={prospect.prospect_logo}
                    alt={brandName}
                    width={150}
                    height={40}
                    className="h-10 w-auto"
                    priority
                  />
                ) : (
                  <Image
                    src="/img/heinekenlogo.png"
                    alt={brandName}
                    width={150}
                    height={40}
                    className="h-10 w-auto"
                    priority
                  />
                )}
              </div>

              {/* Main Headline - Heineken with Gradient */}
              <h1
                style={{
                  fontFamily: "Poppins, sans-serif",
                  fontWeight: 700,
                  fontSize: "clamp(48px, 8vw, 100px)",
                  lineHeight: "100%",
                  letterSpacing: "0%",
                  background: "linear-gradient(90deg, #04AB8B 0%, #0081C5 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  margin: 0,
                }}
              >
                {brandName}
              </h1>

              {/* Sub-headline */}
              <h2
                style={{
                  fontFamily: "Poppins, sans-serif",
                  fontWeight: 600,
                  fontSize: "clamp(32px, 5vw, 64px)",
                  lineHeight: "100%",
                  letterSpacing: "0%",
                  color: "#091917",
                  margin: 0,
                }}
              >
                {brandTheme}
              </h2>

              {/* Subtitle */}
              <p
                style={{
                  fontFamily: "Poppins, sans-serif",
                  fontWeight: 500,
                  fontSize: "36px",
                  lineHeight: "100%",
                  letterSpacing: "0%",
                  color: "#65717C",
                  marginTop: "28px",
                }}
              >
                {brandSubtitle}
              </p>
            </div>

            {/* Right Side - Bottle Image */}
            <div className="flex-1 flex items-start justify-center lg:justify-end">
              <div
                className="relative"
                style={{
                  width: "378px",
                  height: "550px",
                  mixBlendMode: "darken",
                  marginTop: "clamp(10px, 2.5vw, 30px)",
                  opacity: 1,
                }}
              >
                <Image
                  src="/Henkin_bottle.png"
                  alt="Heineken Bottle"
                  width={378}
                  height={550}
                  className="w-full h-full object-contain image-hover fade-in"
                  style={{
                    opacity: 1,
                    animationDelay: "0.3s",
                  }}
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mega Trends Section - Only show if data exists */}
      {megaTrends.length > 0 && (
        <AnimatedSection delay={0.1}>
          <MegaTrends trends={uiTrends} categoryDescription={megaTrendsDescription} />
        </AnimatedSection>
      )}

      {/* Agentic Opportunities Section - Only show if data exists */}
      {opportunities.length > 0 && (
        <AnimatedSection delay={0.2}>
          <AgenticOpportunities opportunities={opportunities} opportunitiesDescription={opportunitiesDescription} />
        </AnimatedSection>
      )}

      {/* Our Agents Spotlight Section - Only show if data exists */}
      {spotlightAgents.length > 0 && (
        <AnimatedSection delay={0.3}>
          <AgentsSpotlight spotlightAgents={spotlightAgents} spotlightAgentsDescription={spotlightAgentsDescription} />
        </AnimatedSection>
      )}

      {/* Want to deploy Tangram section */}
      <AnimatedSection delay={0.4}>
        <section className="w-full py-10 px-0 md:px-0 lg:px-20 mt-0 lg:mt-8 relative overflow-hidden">
          <div className="max-w-7xl mx-auto relative">
            <div className="flex flex-col lg:flex-row lg:items-center lg:gap-12">
              {/* Left Content */}
              <div className="w-full lg:w-1/2 flex flex-col gap-6 lg:gap-8 relative z-10 lg:pr-0">
                {/* Tagline */}
                {/* Main Heading - Can overlap image */}
                <h1
                  className="lg:-mr-32 lg:pr-0 lg:w-[1200px]"
                  style={{
                    fontFamily: "Poppins, sans-serif",
                    fontWeight: 400,
                    fontStyle: "normal",
                    fontSize: "62px",
                    lineHeight: "120%",
                    letterSpacing: "0px",
                    verticalAlign: "middle",
                    background: "linear-gradient(90deg, #2F0368 0%, #5E04D2 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                    color: "transparent",
                    maxWidth: "1200px",
                    minHeight: "148px",
                    opacity: 1,
                    transform: "rotate(0deg)",
                    wordWrap: "break-word",
                    overflowWrap: "break-word",
                    position: "relative",
                    overflow: "visible",
                    top: "55px",
                    marginBottom: "32px"
                  }}
                >
                  Crayon Data Challenge:
                  3 days to <br /> build a working Prototype.
                </h1>

                {/* Subtext */}
                <p
                  style={{
                    fontFamily: "Poppins, sans-serif",
                    color: "#181818",
                    fontSize: "24px",
                    lineHeight: "160%",
                    letterSpacing: "0%",
                    width: "700px",
                    height: "114px",
                    opacity: 1,
                    transform: "rotate(0deg)",
                    position: "relative",
                    marginTop: "10px"
                  }}
                >
                  <span style={{ fontWeight: 600, fontStyle: "normal" }}>We challenge your team.<span style={{ fontWeight: 400, fontStyle: "normal" }} >Take your best AI and Agentic</span></span>
                  <span style={{ fontWeight: 400, fontStyle: "normal" }}>Workflow idea, and we deliver a validated, built, and shipped pilot in just 3 weeks.</span>
                </p>

                {/* Tagline */}
                <p
                  className="max-w-lg flex items-center gap-2 mt-4"
                  style={{
                    fontFamily: "Poppins, sans-serif",
                    fontWeight: 600,
                    fontStyle: "normal",
                    fontSize: "18px",
                    lineHeight: "100%",
                    letterSpacing: "8%",
                    textTransform: "uppercase",
                    color: "#181818"
                  }}
                >
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M2 1L10 6L2 11V1Z" fill="#00AE8D" />
                  </svg>
                  Prove your speed. Ship your future.
                </p>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 mt-4 mb-5">
                  <a
                    href="#"
                    className="text-white text-center transition-all duration-200 hover:opacity-90"
                    style={{
                      fontFamily: "Poppins, sans-serif",
                      fontWeight: 500,
                      fontStyle: "normal",
                      fontSize: "14px",
                      lineHeight: "21px",
                      letterSpacing: "0%",
                      verticalAlign: "middle",
                      textTransform: "uppercase",
                      maxWidth: "1053.95px",
                      borderRadius: "4.09px",
                      opacity: 1,
                      borderWidth: "1px",
                      paddingTop: "12.26px",
                      paddingRight: "16.34px",
                      paddingBottom: "12.26px",
                      paddingLeft: "16.34px",
                      gap: "4.08px",
                      background: "#181818",
                      border: "1px solid #181818",
                      transform: "rotate(0deg)",
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      whiteSpace: "nowrap",
                    }}
                  >
                    ACCEPT THE 3-WEEK CHALLENGE
                  </a>
                  <a
                    href="#"
                    className="text-black text-center transition-all duration-200 hover:bg-gray-50"
                    style={{
                      fontFamily: "Poppins, sans-serif",
                      fontWeight: 500,
                      fontStyle: "normal",
                      fontSize: "14px",
                      lineHeight: "21px",
                      letterSpacing: "0%",
                      verticalAlign: "middle",
                      textTransform: "uppercase",
                      maxWidth: "1053.95px",
                      borderRadius: "4.09px",
                      opacity: 1,
                      borderWidth: "1px",
                      paddingTop: "12.26px",
                      paddingRight: "16.34px",
                      paddingBottom: "12.26px",
                      paddingLeft: "16.34px",
                      gap: "4.08px",
                      background: "#FFFFFF",
                      border: "1px solid #181818",
                      transform: "rotate(0deg)",
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      whiteSpace: "nowrap",
                    }}
                  >
                    SEE HOW WE DO IT
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Right Image - Positioned at extreme right bottom corner */}
          <div className="hidden lg:block absolute right-0 bottom-0 z-0">
            <div className="relative h-auto">
              <Image
                src="/Want_to_deploy_right1.png"
                alt="AI and Agentic Workflow Illustration"
                width={600}
                height={520}
                className="object-contain h-auto max-h-[480px] md:max-h-[520px]"
                style={{ width: "auto", height: "auto", display: "block " }}
                priority
              />
            </div>
          </div>

          {/* Right Image - Mobile/Tablet view */}
          <div className="lg:hidden w-full flex items-center justify-center mt-8">
            <div className="relative h-auto">
              <Image
                src="/Want_to_deploy_right1.png"
                alt="AI and Agentic Workflow Illustration"
                width={600}
                height={520}
                className="object-contain h-auto max-h-[480px] md:max-h-[520px]"
                style={{ width: "auto", height: "auto", display: "block" }}
                priority
              />
            </div>
          </div>
        </section>
      </AnimatedSection>
    </div>
  )
}

// Agent type for Spotlight UI (transformed from API data)
type SpotlightAgentUI = {
  id: string;
  title: string;
  description: string;
  fullDescription?: string;
  tags: string[];
  category: string;
  demoPreview?: string;
};

// Our Agents Spotlight Component
function AgentsSpotlight({
  spotlightAgents = [],
  spotlightAgentsDescription = ""
}: {
  spotlightAgents?: ApiSpotlightAgent[]
  spotlightAgentsDescription?: string
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [agentDetailsMap, setAgentDetailsMap] = useState<Map<string, AgentDetail>>(new Map());
  const [loadingAgents, setLoadingAgents] = useState(false);

  // Fetch agent details for each spotlight agent
  useEffect(() => {
    const fetchAgentDetails = async () => {
      if (spotlightAgents.length === 0) {
        console.log("AgentsSpotlight: No spotlight agents provided");
        return;
      }

      console.log("AgentsSpotlight: Fetching details for", spotlightAgents.length, "agents");
      setLoadingAgents(true);
      const detailsMap = new Map<string, AgentDetail>();
      const uniqueAgentIds = [...new Set(spotlightAgents.map(a => a.agent_id).filter(Boolean))];

      console.log("AgentsSpotlight: Unique agent IDs:", uniqueAgentIds);

      try {
        const agentDetailsPromises = uniqueAgentIds.map(async (agentId) => {
          if (agentId) {
            try {
              const details = await brandsService.fetchAgentDetails(agentId);
              if (details) {
                console.log(`AgentsSpotlight: Fetched details for ${agentId}:`, details.agent_name);
                detailsMap.set(agentId, details);
              } else {
                console.warn(`AgentsSpotlight: No details returned for ${agentId}`);
              }
            } catch (err) {
              console.error(`AgentsSpotlight: Error fetching details for ${agentId}:`, err);
            }
          }
        });

        await Promise.all(agentDetailsPromises);
        console.log("AgentsSpotlight: Total agent details fetched:", detailsMap.size);
        setAgentDetailsMap(detailsMap);
      } catch (error) {
        console.error("AgentsSpotlight: Error fetching agent details:", error);
      } finally {
        setLoadingAgents(false);
      }
    };

    fetchAgentDetails();
  }, [spotlightAgents]);

  // Helper function to truncate description
  const truncateDescription = (description: string, maxLength: number = 120): string => {
    if (!description || description.length <= maxLength) {
      return description
    }
    // Truncate at the last space before maxLength to avoid cutting words
    const truncated = description.substring(0, maxLength)
    const lastSpace = truncated.lastIndexOf(' ')
    if (lastSpace > maxLength * 0.7) {
      return truncated.substring(0, lastSpace) + '...'
    }
    return truncated + '...'
  }

  // Convert spotlight agents to UI format
  const agents = useMemo(() => {
    console.log("AgentsSpotlight: Converting agents, spotlightAgents:", spotlightAgents.length, "agentDetailsMap size:", agentDetailsMap.size);
    return spotlightAgents.map((spotlightAgent) => {
      const agentDetails = agentDetailsMap.get(spotlightAgent.agent_id)
      console.log("AgentsSpotlight: Processing agent", spotlightAgent.agent_id, "details:", agentDetails ? "found" : "not found");

      // Get preview image - handle both JSON array and direct URL strings
      let demoPreview: string | undefined
      if (agentDetails?.demo_preview) {
        try {
          // Try parsing as JSON first
          const parsed = JSON.parse(agentDetails.demo_preview)
          if (Array.isArray(parsed) && parsed.length > 0) {
            demoPreview = parsed[0]
          } else if (typeof parsed === 'string') {
            demoPreview = parsed
          }
        } catch {
          // If not JSON, use as direct string URL
          if (typeof agentDetails.demo_preview === 'string' && agentDetails.demo_preview.trim().length > 0) {
            demoPreview = agentDetails.demo_preview.trim()
          }
        }
      }

      // Determine category
      let category = "Consumer Experience"
      if (agentDetails?.by_value) {
        if (agentDetails.by_value.toLowerCase().includes("data") || agentDetails.by_value.toLowerCase().includes("accelerator")) {
          category = "Data Accelerator"
        } else if (agentDetails.by_value.toLowerCase().includes("productivity") || agentDetails.by_value.toLowerCase().includes("enterprise")) {
          category = "Enterprise Productivity"
        }
      } else if (agentDetails?.asset_type) {
        if (agentDetails.asset_type.toLowerCase().includes("data")) {
          category = "Data Accelerator"
        } else if (agentDetails.asset_type.toLowerCase().includes("productivity")) {
          category = "Enterprise Productivity"
        }
      }

      // Truncate description for clean UI
      const fullDescription = agentDetails?.description || ""
      const truncatedDescription = truncateDescription(fullDescription, 120)

      return {
        id: spotlightAgent.agent_id,
        title: agentDetails?.agent_name || spotlightAgent.agent_name || "Agent",
        description: truncatedDescription,
        fullDescription, // Keep full description for potential tooltip or expansion
        tags: agentDetails?.tags
          ? agentDetails.tags.split(",").map((t: string) => t.trim()).filter(Boolean)
          : [],
        category,
        demoPreview,
      }
    })
  }, [spotlightAgents, agentDetailsMap])

  const handlePrevious = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) => {
      if (prev === 0) {
        // Wrap to the end
        const maxIndex = Math.max(0, agents.length - 2);
        setTimeout(() => setIsTransitioning(false), 600);
        return maxIndex;
      }
      setTimeout(() => setIsTransitioning(false), 600);
      return Math.max(0, prev - 1);
    });
  };

  const handleNext = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) => {
      const maxIndex = Math.max(0, agents.length - 2);
      if (prev >= maxIndex) {
        // Wrap to the beginning
        setTimeout(() => setIsTransitioning(false), 600);
        return 0;
      }
      setTimeout(() => setIsTransitioning(false), 600);
      return Math.min(maxIndex, prev + 1);
    });
  };

  // Get current agents to display (2 at a time)
  const currentAgents = agents.slice(currentIndex, currentIndex + 2);
  const hasAgents = agents.length > 0;
  // Allow navigation if there are more than 2 agents (wraps around)
  const canNavigate = hasAgents && agents.length > 2;

  // Helper function to get category styling
  const getCategoryStyle = (category: string) => {
    if (category === "Data Accelerator") {
      return {
        border: "1px solid #F9DBAF",
        background: "#FEF3C7",
        color: "#B93815",
      };
    } else if (category === "Enterprise Productivity") {
      return {
        border: "1px solid #B2DDFF",
        background: "#E0F2FE",
        color: "#1077D7",
      };
    }
    return {
      border: "1px solid #B2DDFF",
      background: "#E0F2FE",
      color: "#1077D7",
    };
  };


  return (
    <section
      className="w-full py-20 px-8 md:px-16 lg:px-20"
      style={{
        width: "auto",
        height: "937px",
        opacity: 1,
        left: "2px",
        position: "relative",
        background: "linear-gradient(180deg, #FFFFFF 0%, #C3DCF0 76.44%, #FAFAFA 100%)",
        maxWidth: "100%",
      }}
      aria-label="Our Agents Spotlight"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-12">
          <div className="flex-1 mb-6 md:mb-0">
            <h2
              className="mb-4"
              style={{
                fontFamily: "Poppins, sans-serif",
                fontWeight: 500,
                fontSize: "42px",
                lineHeight: "54px",
                letterSpacing: "0%",
                textAlign: "left",
                color: "#091917",
              }}
            >
              Our Agents Spotlight
            </h2>
            <p
              className="max-w-2xl"
              style={{
                fontFamily: "Poppins, sans-serif",
                fontWeight: 400,
                fontSize: "16px",
                lineHeight: "24px",
                letterSpacing: "0px",
                textAlign: "left",
                verticalAlign: "middle",
                color: "#091917",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {spotlightAgentsDescription || "Check out the latest AI agent templates designed for real-world enterprise use cases."}
            </p>
          </div>

          {/* Navigation Arrows */}
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrevious}
              disabled={!canNavigate}
              className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Previous agents"
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M12 15 L7 10 L12 5" stroke="#111827" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <button
              onClick={handleNext}
              disabled={!canNavigate}
              className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Next agents"
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M8 5 L13 10 L8 15" stroke="#111827" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </div>

        {/* Agent Cards Grid */}
        {hasAgents ? (
          <div className="relative overflow-hidden mb-12">
            <div
              className="flex flex-col md:flex-row gap-8"
              style={{
                transition: "transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
                transform: `translateX(0)`,
                willChange: "transform",
              }}
            >
              {/* Agent Card 1 - Large Card */}
              {currentAgents[0] && (
                <div
                  key={`card-1-${currentIndex}`}
                  className="bg-white rounded-2xl shadow-sm border border-gray-100 w-full md:w-[70%] card-hover"
                  style={{
                    paddingTop: "25px",
                    paddingLeft: "10px",
                    transition: "all 0.6s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.6s ease-in-out, transform 0.6s ease-in-out",
                    cursor: "pointer",
                    opacity: isTransitioning ? 0.7 : 1,
                    transform: isTransitioning ? "translateX(10px)" : "translateX(0)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-8px) scale(1.01)"
                    e.currentTarget.style.boxShadow = "0 25px 50px -12px rgba(0, 0, 0, 0.15), 0 10px 20px -5px rgba(0, 0, 0, 0.1)"
                    e.currentTarget.style.borderColor = "#D1D5DB"
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0) scale(1)"
                    e.currentTarget.style.boxShadow = "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)"
                    e.currentTarget.style.borderColor = "#E5E7EB"
                  }}
                  onClick={() => window.location.href = `/agents/${currentAgents[0].id}`}
                >
                  {/* Category Tag */}
                  <div className="mb-4" style={{ paddingLeft: "20px" }}>
                    <span
                      className="inline-block fade-in"
                      style={{
                        opacity: 1,
                        borderRadius: "16324px",
                        paddingTop: "2.04px",
                        paddingRight: "8.71px",
                        paddingBottom: "2.04px",
                        paddingLeft: "8.71px",
                        ...getCategoryStyle(currentAgents[0].category),
                        fontFamily: "Poppins, sans-serif",
                        fontWeight: 500,
                        fontSize: "12px",
                        lineHeight: "15.93px",
                        letterSpacing: "-0.33px",
                        verticalAlign: "middle",
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        transition: "all 0.3s ease",
                        animation: "fadeIn 0.6s ease-out 0.2s both",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = "scale(1.05)"
                        e.currentTarget.style.boxShadow = "0 4px 6px -1px rgba(0, 0, 0, 0.1)"
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = "scale(1)"
                        e.currentTarget.style.boxShadow = "none"
                      }}
                    >
                      {currentAgents[0].category}
                    </span>
                  </div>

                  {/* Content Grid - Text on left, Visualization on right */}
                  <div
                    className="grid grid-cols-1 md:grid-cols-[1fr_1fr] gap-6"
                    style={{
                      width: "calc(100% - 8.5px)",
                      height: "416.1804504394531px",
                      opacity: 1,
                      borderRadius: "12.26px",
                      paddingLeft: "28px",
                      marginBottom: "-8.5px",
                    }}
                  >
                    {/* Left Column - Text Content */}
                    <div className="flex flex-col">
                      {/* Agent Name */}
                      <h3
                        className="mb-3 fade-in-up"
                        style={{
                          fontFamily: "Poppins, sans-serif",
                          fontWeight: 500,
                          fontSize: "24px",
                          lineHeight: "31.86px",
                          letterSpacing: "-0.49px",
                          verticalAlign: "middle",
                          color: "#181818",
                          animation: "fadeInUp 0.6s ease-out 0.3s both",
                        }}
                      >
                        {currentAgents[0].title}
                      </h3>

                      {/* Description */}
                      <p
                        className="mb-4 fade-in-up"
                        style={{
                          fontFamily: "Poppins, sans-serif",
                          fontWeight: 400,
                          fontSize: "14px",
                          lineHeight: "21.45px",
                          letterSpacing: "-0.33px",
                          verticalAlign: "middle",
                          color: "#65717C",
                          animation: "fadeInUp 0.6s ease-out 0.4s both",
                          display: "-webkit-box",
                          WebkitLineClamp: 4,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          maxHeight: "84px", // Approximately 4 lines
                        }}
                      >
                        {currentAgents[0].description}
                      </p>

                      {/* Category Tags */}
                      <div className="flex flex-wrap gap-2">
                        {currentAgents[0].tags.slice(0, 3).map((tag, idx) => (
                          <span
                            key={idx}
                            className="inline-block"
                            style={{
                              opacity: 1,
                              borderRadius: "16324px",
                              paddingTop: "2.04px",
                              paddingRight: "8.71px",
                              paddingBottom: "2.04px",
                              paddingLeft: "8.71px",
                              border: "1px solid #D9E0E3",
                              background: "#FFFFFF4D",
                              fontFamily: "Poppins, sans-serif",
                              fontWeight: 500,
                              fontSize: "12.3px",
                              lineHeight: "15.93px",
                              letterSpacing: "-0.33px",
                              verticalAlign: "middle",
                              color: "#65717C",
                              display: "inline-flex",
                              alignItems: "center",
                              justifyContent: "center",
                              transition: "all 0.2s ease",
                              cursor: "pointer",
                              animation: `fadeInUp 0.5s ease-out ${idx * 0.1}s both`,
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.transform = "translateY(-2px) scale(1.05)"
                              e.currentTarget.style.background = "#FFFFFF80"
                              e.currentTarget.style.borderColor = "#9CA3AF"
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.transform = "translateY(0) scale(1)"
                              e.currentTarget.style.background = "#FFFFFF4D"
                              e.currentTarget.style.borderColor = "#D9E0E3"
                            }}
                          >
                            {tag}
                          </span>
                        ))}
                        {currentAgents[0].tags.length > 3 && (
                          <span
                            className="inline-block"
                            style={{
                              opacity: 1,
                              borderRadius: "16324px",
                              paddingTop: "2.04px",
                              paddingRight: "8.71px",
                              paddingBottom: "2.04px",
                              paddingLeft: "8.71px",
                              border: "1px solid #D9E0E3",
                              background: "#FFFFFF4D",
                              fontFamily: "Poppins, sans-serif",
                              fontWeight: 500,
                              fontSize: "12.3px",
                              lineHeight: "15.93px",
                              letterSpacing: "-0.33px",
                              verticalAlign: "middle",
                              color: "#65717C",
                              display: "inline-flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            +{currentAgents[0].tags.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Right Column - Visual Representation */}
                    <div
                      className="relative rounded-xl overflow-hidden border border-blue-100"
                      style={{
                        width: "357.44000244140625px",
                        height: "399.6400146484375px",
                        opacity: 1,
                        background: "#C0DAEF",
                        backgroundSize: "20px 20px",
                        paddingTop: "8.5px",
                        transition: "all 0.3s ease",
                      }}
                    >
                      {/* Agent preview image or default */}
                      {currentAgents[0].demoPreview ? (
                        <Image
                          src={currentAgents[0].demoPreview}
                          alt={currentAgents[0].title}
                          width={322}
                          height={321}
                          className="absolute image-hover"
                          style={{
                            width: "calc(100% + 50px - 35px)",
                            height: "321px",
                            opacity: 1,
                            top: "78.32px",
                            left: "35px",
                            bottom: "0",
                            objectFit: "cover",
                            borderTopLeftRadius: "40px",
                            transition: "transform 0.5s cubic-bezier(0.4, 0, 0.2, 1), filter 0.3s ease",
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.transform = "scale(1.05)"
                            e.currentTarget.style.filter = "brightness(1.1)"
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.transform = "scale(1)"
                            e.currentTarget.style.filter = "brightness(1)"
                          }}
                          onError={(e) => {
                            // Fallback to default image on error
                            const target = e.target as HTMLImageElement
                            target.src = "/agent_spotlight.png"
                          }}
                          unoptimized={currentAgents[0].demoPreview?.startsWith('http')}
                        />
                      ) : (
                        <Image
                          src="/agent_spotlight.png"
                          alt="Agent visualization"
                          width={322}
                          height={321}
                          className="absolute image-hover"
                          style={{
                            width: "calc(100% + 50px - 35px)",
                            height: "321px",
                            opacity: 1,
                            top: "78.32px",
                            left: "35px",
                            bottom: "0",
                            objectFit: "cover",
                            borderTopLeftRadius: "40px",
                            transition: "transform 0.5s cubic-bezier(0.4, 0, 0.2, 1), filter 0.3s ease",
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.transform = "scale(1.05)"
                            e.currentTarget.style.filter = "brightness(1.1)"
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.transform = "scale(1)"
                            e.currentTarget.style.filter = "brightness(1)"
                          }}
                        />
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Agent Card 2 - Small Card */}
              {currentAgents[1] && (
                <div
                  key={`card-2-${currentIndex}`}
                  className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 w-full md:w-[40%] card-hover"
                  style={{
                    transition: "all 0.6s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.6s ease-in-out, transform 0.6s ease-in-out",
                    cursor: "pointer",
                    opacity: isTransitioning ? 0.7 : 1,
                    transform: isTransitioning ? "translateX(10px)" : "translateX(0)",
                    transitionDelay: "0.1s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-8px) scale(1.01)"
                    e.currentTarget.style.boxShadow = "0 25px 50px -12px rgba(0, 0, 0, 0.15), 0 10px 20px -5px rgba(0, 0, 0, 0.1)"
                    e.currentTarget.style.borderColor = "#D1D5DB"
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0) scale(1)"
                    e.currentTarget.style.boxShadow = "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)"
                    e.currentTarget.style.borderColor = "#E5E7EB"
                  }}
                  onClick={() => window.location.href = `/agents/${currentAgents[1].id}`}
                >
                  {/* Category Tag */}
                  <div className="mb-4">
                    <span
                      className="inline-block fade-in"
                      style={{
                        opacity: 1,
                        borderRadius: "16324px",
                        paddingTop: "2.04px",
                        paddingRight: "8.71px",
                        paddingBottom: "2.04px",
                        paddingLeft: "8.71px",
                        ...getCategoryStyle(currentAgents[1].category),
                        fontFamily: "Poppins, sans-serif",
                        fontWeight: 500,
                        fontSize: "12px",
                        lineHeight: "15.93px",
                        letterSpacing: "-0.33px",
                        verticalAlign: "middle",
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        transition: "all 0.3s ease",
                        animation: "fadeIn 0.6s ease-out 0.2s both",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = "scale(1.05)"
                        e.currentTarget.style.boxShadow = "0 4px 6px -1px rgba(0, 0, 0, 0.1)"
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = "scale(1)"
                        e.currentTarget.style.boxShadow = "none"
                      }}
                    >
                      {currentAgents[1].category}
                    </span>
                  </div>

                  {/* Agent Name */}
                  <h3
                    className="mb-3 fade-in-up"
                    style={{
                      fontFamily: "Poppins, sans-serif",
                      fontWeight: 500,
                      fontSize: "24px",
                      lineHeight: "31.86px",
                      letterSpacing: "-0.49px",
                      verticalAlign: "middle",
                      color: "#181818",
                      animation: "fadeInUp 0.6s ease-out 0.3s both",
                    }}
                  >
                    {currentAgents[1].title}
                  </h3>

                  {/* Description */}
                  <p
                    className="mb-4 fade-in-up"
                    style={{
                      fontFamily: "Poppins, sans-serif",
                      fontWeight: 400,
                      fontSize: "14px",
                      lineHeight: "21.45px",
                      letterSpacing: "-0.33px",
                      verticalAlign: "middle",
                      color: "#65717C",
                      animation: "fadeInUp 0.6s ease-out 0.4s both",
                      display: "-webkit-box",
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      maxHeight: "63px", // Approximately 3 lines for smaller card
                    }}
                  >
                    {currentAgents[1].description}
                  </p>

                  {/* Category Tags */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {currentAgents[1].tags.slice(0, 3).map((tag, idx) => (
                      <span
                        key={idx}
                        className="inline-block"
                        style={{
                          opacity: 1,
                          borderRadius: "16324px",
                          paddingTop: "2.04px",
                          paddingRight: "8.71px",
                          paddingBottom: "2.04px",
                          paddingLeft: "8.71px",
                          border: "1px solid #D9E0E3",
                          background: "#FFFFFF4D",
                          fontFamily: "Poppins, sans-serif",
                          fontWeight: 500,
                          fontSize: "12.3px",
                          lineHeight: "15.93px",
                          letterSpacing: "-0.33px",
                          verticalAlign: "middle",
                          color: "#65717C",
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                          transition: "all 0.2s ease",
                          cursor: "pointer",
                          animation: `fadeInUp 0.5s ease-out ${idx * 0.1}s both`,
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = "translateY(-2px) scale(1.05)"
                          e.currentTarget.style.background = "#FFFFFF80"
                          e.currentTarget.style.borderColor = "#9CA3AF"
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = "translateY(0) scale(1)"
                          e.currentTarget.style.background = "#FFFFFF4D"
                          e.currentTarget.style.borderColor = "#D9E0E3"
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                    {currentAgents[1].tags.length > 3 && (
                      <span
                        className="inline-block"
                        style={{
                          opacity: 1,
                          borderRadius: "16324px",
                          paddingTop: "2.04px",
                          paddingRight: "8.71px",
                          paddingBottom: "2.04px",
                          paddingLeft: "8.71px",
                          border: "1px solid #D9E0E3",
                          background: "#FFFFFF4D",
                          fontFamily: "Poppins, sans-serif",
                          fontWeight: 500,
                          fontSize: "12.3px",
                          lineHeight: "15.93px",
                          letterSpacing: "-0.33px",
                          verticalAlign: "middle",
                          color: "#65717C",
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        +{currentAgents[1].tags.length - 3} more
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-64">
            <p style={{ fontFamily: "Poppins, sans-serif", color: "#091917" }}>No agents available</p>
          </div>
        )}

        {/* CTA Section */}
        <div
          className="flex flex-col md:flex-row items-center justify-between gap-4"
          style={{
            width: "1053.93701171875px",
            height: "96.53140258789062px",
            opacity: 1,
            position: "relative",
            borderRadius: "12.26px",
            paddingTop: "24.51px",
            paddingRight: "24.5px",
            paddingBottom: "24.51px",
            paddingLeft: "24.5px",
            background: "#FFFFFF66",
            maxWidth: "100%",
            margin: "0 auto",
          }}
        >
          <p
            style={{
              fontFamily: "Poppins, sans-serif",
              fontWeight: 500,
              fontSize: "24px",
              lineHeight: "31.86px",
              letterSpacing: "-0.49px",
              verticalAlign: "middle",
              color: "#181818",
            }}
          >
            Explore all 100+ agents and solutions
          </p>
          <button
            className="uppercase transition-all duration-200 hover:opacity-90"
            style={{
              width: "230.68060302734375px",
              height: "47.510398864746094px",
              maxWidth: "1053.95px",
              opacity: 1,
              borderRadius: "4.09px",
              paddingTop: "12.26px",
              paddingRight: "16.34px",
              paddingBottom: "12.26px",
              paddingLeft: "16.34px",
              gap: "4.08px",
              backgroundColor: "#181818",
              border: "1px solid #181818",
              fontFamily: "Poppins, sans-serif",
              fontWeight: 500,
              fontSize: "14px",
              lineHeight: "21px",
              letterSpacing: "0%",
              verticalAlign: "middle",
              color: "#FFFFFF",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            GO TO AGENT MARKETPLACE
          </button>
        </div>
      </div>
    </section>
  )
}

// Agentic Opportunities Component
interface AgentContent {
  label: string
  title: string
  opportunity: string
  solution: string[]
  businessImpact: string
  marketValidation: string
}

interface FilterData {
  [key: string]: AgentContent
}

interface PillData {
  [key: string]: AgentContent
}

const ALL_PILLS = [
  "Retailer App + Agentic Personalization Layer",
  "E-Commerce PDP Agent",
  "IoT-Enabled Smart Tap + Experience Agent",
  "Heineken Digital Universe App (D2C)",
]

// StackedAgentCards Component - Reusable scroll-based stacked card UI
function StackedAgentCards({ cards }: { cards: AgentContent[] }) {
  const [activeCardIndex, setActiveCardIndex] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)
  const cardRefs = useRef<(HTMLDivElement | null)[]>([])
  const scrollDistance = 800 // Fixed scroll distance per card - increased for more readable transitions

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return

      const container = containerRef.current
      const containerTop = container.getBoundingClientRect().top
      const viewportHeight = window.innerHeight

      // Calculate scroll progress within the container
      // Start when container enters viewport
      const scrollStart = viewportHeight
      const scrollProgress = Math.max(0, scrollStart - containerTop)

      // Determine active card based on scroll distance with smoother transitions
      // Each card becomes active after scrolling a fixed distance
      // Use more granular calculation for smoother progression
      const rawIndex = scrollProgress / scrollDistance
      const newActiveIndex = Math.min(
        cards.length - 1,
        Math.max(0, Math.floor(rawIndex))
      )

      // Update active index for smoother transitions
      if (newActiveIndex !== activeCardIndex) {
        setActiveCardIndex(newActiveIndex)
      }
    }

    let ticking = false
    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          handleScroll()
          ticking = false
        })
        ticking = true
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })
    handleScroll()

    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [activeCardIndex, cards.length, scrollDistance])

  const renderCard = (content: AgentContent, index: number) => {
    const isActive = index === activeCardIndex
    const isVisible = index <= activeCardIndex
    const stackPosition = activeCardIndex - index // 0 = active, 1 = first behind, 2 = second behind, etc.

    // Progressive transforms for stacked cards - more visible and smoother
    const getCardStyles = () => {
      if (!isVisible) {
        return {
          opacity: 0,
          transform: 'scale(0.92) translateY(60px)',
          zIndex: 1,
        }
      }

      if (isActive) {
        // Active card: full size, full opacity, highest z-index
        return {
          opacity: 1,
          transform: 'scale(1) translateY(0)',
          zIndex: 100 + cards.length,
        }
      }

      // Stacked cards behind active card - more visible with better progression
      // Extended arrays to handle all 7 cards smoothly
      const scaleValues = [0.96, 0.92, 0.88, 0.84, 0.80, 0.76, 0.72]
      const opacityValues = [0.85, 0.70, 0.55, 0.40, 0.30, 0.20, 0.15]
      const translateYValues = [-15, -30, -45, -60, -75, -90, -105]

      // Calculate index for arrays (stackPosition - 1 because stackPosition 0 is active)
      const arrayIndex = stackPosition - 1

      // Use the value from array if available, otherwise calculate progressively
      const scale = arrayIndex < scaleValues.length
        ? scaleValues[arrayIndex]
        : Math.max(0.70, 0.96 - (arrayIndex * 0.04))
      const opacity = arrayIndex < opacityValues.length
        ? opacityValues[arrayIndex]
        : Math.max(0.10, 0.85 - (arrayIndex * 0.10))
      const translateY = arrayIndex < translateYValues.length
        ? translateYValues[arrayIndex]
        : -15 - (arrayIndex * 15)
      const zIndex = 100 + cards.length - stackPosition

      return {
        opacity,
        transform: `scale(${scale}) translateY(${translateY}px)`,
        zIndex,
      }
    }

    const styles = getCardStyles()
    const shadowIntensity = isActive ? 0.2 : Math.max(0.08, 0.2 - stackPosition * 0.025)

    return (
      <div
        key={index}
        ref={(el) => {
          cardRefs.current[index] = el
        }}
        className="rounded-2xl border border-[#e6e6ea] p-7 md:p-9 relative overflow-hidden"
        style={{
          fontFamily: "Poppins, sans-serif",
          backgroundColor: "#FFFFFF",
          position: "sticky",
          top: "100px",
          width: "100%",
          minHeight: "600px",
          marginBottom: index < cards.length - 1 ? `-${scrollDistance - 200}px` : "150px",
          marginTop: index === 0 ? "0" : "0",
          transition: "opacity 1.2s cubic-bezier(0.16, 1, 0.3, 1), transform 1.2s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 1s ease-out",
          willChange: "transform, opacity",
          pointerEvents: isActive ? "auto" : "none",
          ...styles,
          boxShadow: isVisible
            ? `0 ${8 + stackPosition * 4}px ${25 + stackPosition * 8}px rgba(0, 0, 0, ${shadowIntensity}), 0 0 0 1px rgba(0, 0, 0, 0.05)`
            : "none",
        }}
      >
        <div className="relative z-10" style={{ maxWidth: "calc(100% - 320px)", paddingRight: "20px" }}>
          {/* Agent Label */}
          <span
            className="inline-block mb-4"
            style={{
              fontFamily: "Poppins, sans-serif",
              fontWeight: 500,
              fontStyle: "normal",
              fontSize: "12px",
              lineHeight: "140%",
              letterSpacing: "0%",
              textAlign: "center",
              color: "#F05283",
              width: "78.99999959707212px",
              height: "31.999999836788707px",
              transform: "rotate(-0.28deg)",
              opacity: 1,
              borderRadius: "4px",
              paddingTop: "4px",
              paddingRight: "16px",
              paddingBottom: "4px",
              paddingLeft: "16px",
              gap: "8px",
              background: "#FFEBF1",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {content.label}
          </span>

          {/* Card Title */}
          <h3
            className="mb-6"
            style={{
              fontFamily: "Poppins, sans-serif",
              fontWeight: 500,
              fontStyle: "normal",
              fontSize: "24px",
              lineHeight: "31.86px",
              letterSpacing: "-0.49px",
              verticalAlign: "middle",
              color: "#181818",
              width: "511px",
              height: "32px",
              maxWidth: "100%",
            }}
          >
            {content.title}
          </h3>

          {/* OPPORTUNITY, SOLUTION, and BUSINESS IMPACT Sections - Two Column Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 pb-6 border-b border-[#e6e6ea]">
            {/* Left Column: OPPORTUNITY and BUSINESS IMPACT */}
            <div className="flex flex-col gap-6">
              {/* OPPORTUNITY Section */}
              <div>
                <div className="flex items-center gap-0 mb-2">
                  <div
                    className="flex items-center justify-center rounded"
                    style={{
                      width: "24px",
                      height: "24px",
                    }}
                  >
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <circle cx="7" cy="7" r="6" stroke="#F05283" strokeWidth="1.5" fill="none" />
                      <circle cx="7" cy="7" r="3" fill="#F05283" />
                    </svg>
                  </div>
                  <p
                    style={{
                      fontFamily: "Poppins, sans-serif",
                      fontWeight: 600,
                      fontStyle: "normal",
                      fontSize: "14px",
                      lineHeight: "21px",
                      letterSpacing: "0%",
                      verticalAlign: "middle",
                      color: "#111827",
                      textTransform: "uppercase",
                      margin: 0,
                    }}
                  >
                    OPPORTUNITY
                  </p>
                </div>
                <p
                  style={{
                    fontFamily: "Poppins, sans-serif",
                    fontWeight: 400,
                    fontStyle: "normal",
                    fontSize: "14px",
                    lineHeight: "21.45px",
                    letterSpacing: "-0.33px",
                    verticalAlign: "middle",
                    color: "#65717C",
                    marginLeft: "8px",
                  }}
                >
                  {content.opportunity}
                </p>
              </div>

              {/* BUSINESS IMPACT Section */}
              <div>
                <div className="flex items-center gap-0 mb-2">
                  <div
                    className="flex items-center justify-center rounded"
                    style={{
                      width: "24px",
                      height: "24px",
                    }}
                  >
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <path d="M2 10 L4 6 L7 8 L10 4 L12 6" stroke="#10B981" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M10 4 L12 4 L12 6" stroke="#10B981" strokeWidth="1.5" fill="none" strokeLinecap="round" />
                    </svg>
                  </div>
                  <p
                    style={{
                      fontFamily: "Poppins, sans-serif",
                      fontWeight: 600,
                      fontStyle: "normal",
                      fontSize: "14px",
                      lineHeight: "21px",
                      letterSpacing: "0%",
                      verticalAlign: "middle",
                      color: "#111827",
                      textTransform: "uppercase",
                      margin: 0,
                    }}
                  >
                    BUSINESS IMPACT
                  </p>
                </div>
                <p
                  style={{
                    fontFamily: "Poppins, sans-serif",
                    fontWeight: 400,
                    fontStyle: "normal",
                    fontSize: "14px",
                    lineHeight: "21.45px",
                    letterSpacing: "-0.33px",
                    verticalAlign: "middle",
                    color: "#65717C",
                    marginLeft: "8px",
                  }}
                >
                  {content.businessImpact}
                </p>
              </div>
            </div>

            {/* Right Column: SOLUTION Section */}
            <div>
              <div className="flex items-center gap-0 mb-3">
                <div
                  className="flex items-center justify-center rounded"
                  style={{
                    width: "24px",
                    height: "24px",
                  }}
                >
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M7 2 L9 6 L13 7 L9 8 L7 12 L5 8 L1 7 L5 6 Z" fill="#3B82F6" />
                  </svg>
                </div>
                <p
                  style={{
                    fontFamily: "Poppins, sans-serif",
                    fontWeight: 600,
                    fontStyle: "normal",
                    fontSize: "14px",
                    lineHeight: "21px",
                    letterSpacing: "0%",
                    verticalAlign: "middle",
                    color: "#111827",
                    textTransform: "uppercase",
                    margin: 0,
                  }}
                >
                  SOLUTION
                </p>
              </div>
              <ul className="space-y-2">
                {content.solution.map((item, idx) => (
                  <li
                    key={idx}
                    className="flex items-start"
                    style={{
                      fontFamily: "Poppins, sans-serif",
                      fontWeight: 400,
                      fontStyle: "normal",
                      fontSize: "14px",
                      lineHeight: "21.45px",
                      letterSpacing: "-0.33px",
                      verticalAlign: "middle",
                      color: "#65717C",
                      marginLeft: "8px",
                    }}
                  >
                    <span className="mr-2 text-[#6b2bb2]">•</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* MARKET VALIDATION Section */}
          <div>
            <div className="flex items-center gap-0 mb-2">
              <div
                className="flex items-center justify-center rounded"
                style={{
                  width: "24px",
                  height: "24px",
                }}
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M7 2 L8 5 L11 6 L8 7 L7 10 L6 7 L3 6 L6 5 Z" fill="#F59E0B" />
                  <circle cx="7" cy="7" r="1.5" fill="#F59E0B" />
                </svg>
              </div>
              <p
                style={{
                  fontFamily: "Poppins, sans-serif",
                  fontWeight: 600,
                  fontStyle: "normal",
                  fontSize: "14px",
                  lineHeight: "21px",
                  letterSpacing: "0%",
                  verticalAlign: "middle",
                  color: "#111827",
                  textTransform: "uppercase",
                  margin: 0,
                }}
              >
                MARKET VALIDATION
              </p>
            </div>
            <p
              style={{
                fontFamily: "Poppins, sans-serif",
                fontWeight: 400,
                fontStyle: "normal",
                fontSize: "14px",
                lineHeight: "21.45px",
                letterSpacing: "-0.33px",
                verticalAlign: "middle",
                color: "#65717C",
                marginLeft: "8px",
              }}
            >
              {content.marketValidation}
            </p>
          </div>
        </div>

        {/* Right Side Image */}
        <img
          src="/Agentic_usecase_right.png"
          alt="Agentic Usecase"
          style={{
            position: "absolute",
            width: "280px",
            height: "434px",
            top: "42.41px",
            right: "20px",
            opacity: 1,
            borderRadius: "24px",
            zIndex: 5,
          }}
        />
      </div>
    )
  }

  return (
    <div
      ref={containerRef}
      className="relative"
      style={{
        minHeight: `${scrollDistance * cards.length}px`,
        paddingTop: "100px",
        paddingBottom: "200px",
      }}
    >
      {cards.map((card, index) => renderCard(card, index))}
    </div>
  )
}

function AgenticOpportunities({
  initialFilter = "CONSUMER EXPERIENCE",
  opportunities = [],
  opportunitiesDescription = ""
}: {
  initialFilter?: string
  opportunities?: ParsedOpportunity[]
  opportunitiesDescription?: string
}) {
  const [activeFilter, setActiveFilter] = useState(initialFilter)
  const [selectedPills, setSelectedPills] = useState<string[]>([])
  const [activePill, setActivePill] = useState<string>("")

  // Extract unique themes from API opportunities
  const { uniqueThemes, groupedByTheme } = useMemo(() => {
    if (opportunities.length === 0) {
      return { uniqueThemes: [], groupedByTheme: {} }
    }

    const grouped: { [key: string]: ParsedOpportunity[] } = {}
    const themesSet = new Set<string>()

    opportunities.forEach((opp) => {
      const theme = opp.theme?.trim() || "Other"
      const themeUpper = theme.toUpperCase()

      // Normalize theme names but keep original for display
      let normalizedTheme = themeUpper

      // Map common variations to standard names
      if (themeUpper.includes("CONSUMER") || themeUpper.includes("CUSTOMER")) {
        normalizedTheme = "CONSUMER EXPERIENCE"
      } else if (themeUpper.includes("ENTERPRISE") || themeUpper.includes("EMPLOYEE") ||
        themeUpper.includes("PRODUCTIVITY") || themeUpper.includes("PORDUCTIVITY") ||
        (themeUpper.includes("ENTERPRISE") && themeUpper.includes("DUCTIVITY"))) {
        // Handle both "PRODUCTIVITY" and typo "PORDUCTIVITY" from API
        normalizedTheme = "ENTERPRISE PRODUCTIVITY"
      } else if (themeUpper.includes("DATA")) {
        normalizedTheme = "DATA ACCELERATOR"
      } else {
        // Use the theme as-is, but uppercase for consistency
        normalizedTheme = themeUpper
      }

      themesSet.add(normalizedTheme)

      if (!grouped[normalizedTheme]) {
        grouped[normalizedTheme] = []
      }
      grouped[normalizedTheme].push(opp)
    })

    const uniqueThemes = Array.from(themesSet).sort()

    return { uniqueThemes, groupedByTheme: grouped }
  }, [opportunities])

  // Get filters - use API themes if available, otherwise fallback to defaults
  const filters = useMemo(() => {
    if (uniqueThemes.length > 0) {
      return uniqueThemes
    }
    return ["CONSUMER EXPERIENCE", "ENTERPRISE PRODUCTIVITY", "DATA ACCELERATOR"]
  }, [uniqueThemes])

  // Set initial filter to first available theme
  useEffect(() => {
    if (filters.length > 0 && !filters.includes(activeFilter)) {
      setActiveFilter(filters[0])
    }
  }, [filters, activeFilter])

  // Agent content data for each filter (fallback)
  const agentData: FilterData = {
    "CONSUMER EXPERIENCE": {
      label: "AGENT 1",
      title: "Retailer App + Agentic Personalization Layer",
      opportunity: "Retailers rely on distributors. Heineken has no direct visibility into retailer-level demand, assortment, or motivation. No personalization.",
      solution: [
        "Personalized SKU recommendations",
        "Auto-generated order quantities based on neighborhood trends",
        "Offers personalized to each store",
        "Automated notifications, creatives, and micro-campaigns",
      ],
      businessImpact: "Increase total throughput, improves visibility of on-premise, strengthen retailer loyalty, enables precise push of Heineken O",
      marketValidation: "Works with existing distributor margin structures. Used successfully by Coke Buddy, Unilever, P&G",
    },
    "ENTERPRISE PRODUCTIVITY": {
      label: "AGENT 2",
      title: "Enterprise Productivity Agent",
      opportunity: "Internal teams spend significant time on repetitive tasks and data management, reducing focus on strategic initiatives.",
      solution: [
        "Automated report generation and distribution",
        "Intelligent document processing and summarization",
        "Workflow automation for common processes",
        "AI-powered meeting notes and action items",
      ],
      businessImpact: "Reduce operational overhead, free up team capacity for strategic work, improve decision-making speed",
      marketValidation: "Proven ROI in similar FMCG organizations. Adopted by leading enterprises in beverage industry",
    },
    "DATA ACCELERATOR": {
      label: "AGENT 3",
      title: "Data Accelerator Agent",
      opportunity: "Data silos and manual data processing limit real-time insights and decision-making capabilities across the organization.",
      solution: [
        "Automated data pipeline orchestration",
        "Real-time data quality monitoring and alerts",
        "Intelligent data transformation and enrichment",
        "Self-service analytics and reporting",
      ],
      businessImpact: "Accelerate time-to-insight, improve data quality, enable data-driven decision making at scale",
      marketValidation: "Industry-standard approach used by data-forward organizations. Validated in production environments",
    },
  }

  // Pill-specific content data based on reference screenshot
  const pillData: PillData = {
    "Retailer App + Agentic Personalization Layer": {
      label: "AGENT 2",
      title: "Retailer App + Agentic Personalisation Layer",
      opportunity: "Retailers rely on distributors. Heineken has no direct visibility into retailer-level demand, assortment, or motivation. No personalization.",
      solution: [
        "Personalized SKU recommendations",
        "Auto-generated order quantities based on neighborhood trends",
        "Offers personalized to each store",
        "Automated notifications, creatives, and micro-campaigns",
      ],
      businessImpact: "Increases retail throughput, improves visibility of demand, strengthens retailer loyalty, enables precise push of Heineken O",
      marketValidation: "Works without disrupting distributor margin structure. Used successfully by Coke Buddy, Unilever, P&G",
    },
    "E-Commerce PDP Agent": {
      label: "AGENT 1",
      title: "E-Commerce PDP Agent",
      opportunity: "E-commerce platforms lack personalized product discovery and recommendation capabilities for beverage consumers.",
      solution: [
        "AI-powered product recommendations",
        "Personalized search and discovery",
        "Dynamic pricing optimization",
        "Cross-sell and upsell automation",
      ],
      businessImpact: "Increases conversion rates, improves customer engagement, drives higher average order value",
      marketValidation: "Proven in e-commerce platforms. Used by leading retail brands",
    },
    "IoT-Enabled Smart Tap + Experience Agent": {
      label: "AGENT 3",
      title: "IoT-Enabled Smart Tap + Experience Agent",
      opportunity: "Smart tap systems generate data but lack intelligent insights and personalized experiences for consumers.",
      solution: [
        "Real-time consumption analytics",
        "Personalized pour recommendations",
        "Smart inventory management",
        "Consumer engagement through mobile app",
      ],
      businessImpact: "Optimizes inventory, enhances consumer experience, provides data-driven insights for venue operators",
      marketValidation: "IoT solutions validated in hospitality industry. Growing adoption in smart venues",
    },
    "Heineken Digital Universe App (D2C)": {
      label: "AGENT 4",
      title: "Heineken Digital Universe App (D2C)",
      opportunity: "Direct-to-consumer channels need intelligent agents to provide personalized experiences and drive engagement.",
      solution: [
        "Personalized content recommendations",
        "AI-powered customer support",
        "Loyalty program optimization",
        "Predictive ordering and delivery",
      ],
      businessImpact: "Increases customer lifetime value, improves retention, enables direct consumer relationships",
      marketValidation: "D2C models proven successful. Used by beverage brands globally",
    },
  }

  // Convert API opportunities to AgentContent format based on active filter
  const convertOpportunitiesToAgentContent = (opps: ParsedOpportunity[], filterTheme: string): AgentContent[] => {
    const filterOpps = groupedByTheme[filterTheme] || []

    return filterOpps.map((opp, index) => ({
      label: `AGENT ${index + 1}`,
      title: opp.opportunity_title || "Opportunity",
      opportunity: opp.parsed.opportunity || "",
      solution: opp.parsed.solution || [],
      businessImpact: opp.parsed.impact || "",
      marketValidation: opp.parsed.validation || "",
    }))
  }

  // Create array of card contents based on active filter - use API data if available, otherwise fallback
  const allCardContents = useMemo(() => {
    if (opportunities.length > 0 && activeFilter && groupedByTheme[activeFilter]) {
      return convertOpportunitiesToAgentContent(opportunities, activeFilter)
    }
    // Fallback to default data
    return filters.map(filter => agentData[filter] || {
      label: "AGENT 1",
      title: filter,
      opportunity: "",
      solution: [],
      businessImpact: "",
      marketValidation: "",
    })
  }, [opportunities, activeFilter, filters, groupedByTheme])

  const handlePillClick = (pill: string) => {
    // If pill is not already selected, add it to selected pills
    if (!selectedPills.includes(pill)) {
      setSelectedPills([...selectedPills, pill])
    }
    // Set as active pill (for content display)
    setActivePill(pill)
  }

  return (
    <section
      className="w-full py-16 px-8 md:px-20 lg:px-20 relative"
      style={{

        backgroundImage: "url('/Agentic_card_backdrop.png')",
        backgroundSize: "contain",
        backgroundPosition: "0% 0% 0% 0% ",
        backgroundRepeat: "no-repeat",
        opacity: 1,
        //   background: `
        //   radial-gradient(1200px 800px at 85% 35%, 
        //     #ff6fae 0%, 
        //     #d9468f 25%, 
        //     #c7b8ff 45%, 
        //     #ffffff 70%
        //   ),
        //   radial-gradient(900px 700px at 90% 15%, 
        //     #ffe8a3 0%, 
        //     #ffb38a 35%, 
        //     rgba(255,255,255,0) 65%
        //   ),
        //   #ffffff
        // `,


      }}
      aria-labelledby="agentic-opportunities-heading"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-8">
          <h2
            id="agentic-opportunities-heading"
            className="mx-auto"
            style={{
              fontFamily: "Poppins, sans-serif",
              fontWeight: 600,
              fontStyle: "normal",
              fontSize: "28px",
              lineHeight: "100%",
              letterSpacing: "0px",
              textAlign: "center",
              verticalAlign: "middle",
              background: "linear-gradient(90deg, #EE4C75 0%, #F07558 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              width: "313px",
              height: "42px",
              marginBottom: "-4px",
            }}
          >
            Agentic Opportunities
          </h2>
          <p
            className="mb-8 mx-auto"
            style={{
              fontFamily: "Poppins, sans-serif",
              fontWeight: 400,
              fontStyle: "normal",
              fontSize: "16px",
              lineHeight: "24px",
              letterSpacing: "0%",
              textAlign: "center",
              color: "#111827",
              width: "790px",
              height: "48px",
              maxWidth: "100%",
            }}
          >
            {opportunitiesDescription || "To unlock growth, we've organized the opportunity landscape into three clear, CEO-aligned buckets..."}
          </p>

          {/* Filter Pills */}
          <div className="flex flex-wrap justify-center gap-3 mb-12" role="tablist" aria-label="Filter opportunities">
            {filters.map((filter) => (
              <button
                key={filter}
                role="tab"
                aria-selected={activeFilter === filter}
                aria-controls={`agent-content-${filter.toLowerCase().replace(/\s+/g, "-")}`}
                onClick={() => setActiveFilter(filter)}
                className={`px-6 py-2 rounded-full transition-all duration-200 ${activeFilter === filter
                  ? "bg-[#181818] text-white shadow-md"
                  : "bg-white text-[#6b6b7a] border border-[#D9E0E3] hover:border-[#181818]"
                  }`}
                style={{
                  fontFamily: "Poppins, sans-serif",
                  fontWeight: activeFilter === filter ? 500 : 400,
                  fontStyle: "normal",
                  fontSize: activeFilter === filter ? "16px" : "14px",
                  lineHeight: activeFilter === filter ? "100%" : "normal",
                  letterSpacing: activeFilter === filter ? "0px" : "normal",
                  verticalAlign: activeFilter === filter ? "middle" : "normal",
                  textTransform: activeFilter === filter ? "uppercase" : "none",
                  color: activeFilter === filter ? "#FFFFFF" : "#6b6b7a",
                }}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        {/* Stacked Cards Component */}
        <StackedAgentCards cards={allCardContents} />
      </div>
    </section>
  )
}

