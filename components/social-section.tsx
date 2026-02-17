"use client"

import Image from "next/image"
import { ArrowUpRight, Heart, MessageCircle, Repeat2, Bookmark } from "lucide-react"

const LinkedInIcon = () => (
  <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="#737373">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
)

const XIcon = () => (
  <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="#737373">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
)

const YouTubeIcon = () => (
  <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="#737373">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
  </svg>
)

const YOUTUBE_VIDEO_ID = "dexgKM9uVrQ"
const YOUTUBE_THUMBNAIL = `https://img.youtube.com/vi/${YOUTUBE_VIDEO_ID}/maxresdefault.jpg`
const YOUTUBE_THUMBNAIL_FALLBACK = `https://img.youtube.com/vi/${YOUTUBE_VIDEO_ID}/hqdefault.jpg`
const YOUTUBE_LINK = "https://youtu.be/dexgKM9uVrQ?si=JDojT9O7ieoktjnF"

const campaigns = [
  {
    id: 1,
    platform: "linkedin" as const,
    type: "Tribute",
    title: "A Tribute to Tim Kobe: A Visionary and a Friend",
    excerpt: "Last week, Crayon Data lost a titan, a partner, and a dear friend. Tim Kobe didn't just design…",
    image: "/img/tim-kobe-portrait.png",
    link: "https://www.linkedin.com/company/crayondata",
    author: { name: "Suresh V Shankar", handle: "@sureshshankar", avatar: "S" },
    stats: { likes: "7", comments: "12", shares: "3" },
    date: "2d ago",
    tags: ["Tribute", "Tim Kobe", "Design"],
  },
  {
    id: 2,
    platform: "youtube" as const,
    type: "Video",
    title: "Crayon Data on YouTube",
    excerpt: "Watch our latest video — from demos to insights on AI and enterprise.",
    image: null,
    imageExternal: YOUTUBE_THUMBNAIL,
    imageExternalFallback: YOUTUBE_THUMBNAIL_FALLBACK,
    link: YOUTUBE_LINK,
    author: { name: "Crayon Data", handle: "@crayondata", avatar: "C" },
    stats: { likes: "—", comments: "—", shares: "—" },
    date: "YouTube",
    tags: ["Video", "YouTube"],
  },
]

export function SocialSection() {
  return (
    <section className="py-24 md:py-32 bg-background">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header - Group 1410104292 / 1410104291 / 1410104290 */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-16">
          <div>
            <div className="flex items-center gap-3 mb-4" style={{ gap: "12px" }}>
              <span
                className="shrink-0"
                style={{
                  minWidth: "32px",
                  height: "1px",
                  background: "rgba(10, 10, 10, 0.4)",
                }}
              />
              <span
                className="font-mono uppercase flex items-center"
                style={{
                  fontFamily: "var(--font-geist-mono), 'Geist Mono', monospace",
                  fontWeight: 400,
                  fontSize: "12px",
                  lineHeight: "16px",
                  letterSpacing: "1.2px",
                  color: "rgba(10, 10, 10, 0.7)",
                }}
              >
                Social
              </span>
            </div>
            <h2
              className="tracking-tight"
              style={{
                fontFamily: "var(--font-geist-sans), 'Geist', sans-serif",
                fontWeight: 300,
                fontSize: "36px",
                lineHeight: "40px",
                background: "linear-gradient(90deg, #CF57C8 0%, #DE8900 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Just In — From Our World
            </h2>
          </div>
          
          {/* Group 1410104288 - Follow links */}
          <div className="flex flex-wrap gap-3">
            <a
              href="https://linkedin.com/company/crayondata"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 box-border border hover:opacity-80 transition-opacity"
              style={{
                padding: "9px 17px",
                gap: "8px",
                border: "1px solid #E5E5E5",
                fontFamily: "var(--font-geist-sans), 'Geist', sans-serif",
                fontWeight: 400,
                fontSize: "14px",
                lineHeight: "20px",
                color: "#737373",
              }}
            >
              <LinkedInIcon />
              <span>Follow</span>
              <ArrowUpRight className="w-3 h-3 shrink-0" strokeWidth={1.33333} style={{ color: "#737373" }} />
            </a>
            <a
              href="https://x.com/crayondata"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 box-border border hover:opacity-80 transition-opacity"
              style={{
                padding: "9px 17px",
                gap: "8px",
                border: "1px solid #E5E5E5",
                fontFamily: "var(--font-geist-sans), 'Geist', sans-serif",
                fontWeight: 400,
                fontSize: "14px",
                lineHeight: "20px",
                color: "#737373",
              }}
            >
              <XIcon />
              <span>Follow</span>
              <ArrowUpRight className="w-3 h-3 shrink-0" strokeWidth={1.33333} style={{ color: "#737373" }} />
            </a>
          </div>
        </div>

        {/* Cards - Group 1410104289: 3 cards, white bg, border #E5E5E5 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6 items-stretch">
          {campaigns.map((campaign) => (
              <a
                key={campaign.id}
                href={campaign.link}
                target="_blank"
                rel="noopener noreferrer"
              className="group flex flex-col h-full min-h-0 box-border bg-white border hover:opacity-95 transition-opacity overflow-hidden"
                style={{
                border: "1px solid #E5E5E5",
                minHeight: "520px",
              }}
            >
              {/* Top image / overlay area - fixed height for row alignment */}
              <div
                className="relative w-full shrink-0 overflow-hidden"
                style={{ height: "222px", background: "rgba(245, 245, 245, 0.3)" }}
              >
                {campaign.image && (
                  <Image
                    src={campaign.image}
                    alt=""
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 357px"
                  />
                )}
                {"imageExternal" in campaign && campaign.imageExternal && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={campaign.imageExternal}
                    alt=""
                    className="absolute inset-0 w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.currentTarget
                      if ("imageExternalFallback" in campaign && campaign.imageExternalFallback)
                        target.src = campaign.imageExternalFallback
                    }}
                  />
                )}
                <div
                  className="absolute inset-0 opacity-[0.03] pointer-events-none"
                  style={{
                    background:
                      "linear-gradient(180deg, #0A0A0A 5%, rgba(10, 10, 10, 0) 5%), linear-gradient(90deg, #0A0A0A 5%, rgba(10, 10, 10, 0) 5%)",
                  }}
                />
                {/* Badge pill - Overlay+Border+OverlayBlur */}
                <div
                  className="absolute left-3 top-3 flex items-center gap-2 px-2 py-1.5 box-border rounded-sm"
                  style={{
                    background: "rgba(255, 255, 255, 0.9)",
                    border: "1px solid rgba(229, 229, 229, 0.5)",
                    backdropFilter: "blur(4px)",
                  }}
                >
                  {campaign.platform === "youtube" ? <YouTubeIcon /> : campaign.platform === "linkedin" ? <LinkedInIcon /> : <XIcon />}
                  <span
                    className="font-mono uppercase"
                    style={{
                      fontFamily: "var(--font-geist-mono), 'Geist Mono', monospace",
                      fontWeight: 400,
                      fontSize: "10px",
                      lineHeight: "15px",
                      letterSpacing: "0.5px",
                      color: "#737373",
                    }}
                  >
                    {campaign.type}
                  </span>
                </div>
              </div>

              <div className="p-5 flex flex-col flex-1 min-h-0">
                {/* Tags row - fixed height for row alignment */}
                <div className="flex flex-wrap gap-0 border-b border-[#E5E5E5] pb-2 mb-3 shrink-0" style={{ minHeight: "27px" }}>
                    {campaign.tags.map((tag, i) => (
                      <span 
                        key={i}
                      className="flex items-center font-mono border-r border-[#E5E5E5] pr-2 last:border-r-0 last:pr-0 first:pl-0"
                      style={{
                        fontFamily: "var(--font-geist-mono), 'Geist Mono', monospace",
                        fontWeight: 400,
                        fontSize: "10px",
                        lineHeight: "15px",
                        color: "#737373",
                        marginLeft: i === 0 ? 0 : "8px",
                      }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                {/* Heading 3 - fixed 2-line height for row alignment */}
                  <h3 
                  className="mb-3 shrink-0 line-clamp-2"
                    style={{
                    fontFamily: "var(--font-geist-sans), 'Geist', sans-serif",
                    fontWeight: 500,
                    fontSize: "16px",
                    lineHeight: "24px",
                    color: "#0A0A0A",
                    minHeight: "48px",
                    }}
                  >
                    {campaign.title}
                  </h3>

                {/* Excerpt - fixed 3-line height for row alignment */}
                <p
                  className="mb-4 shrink-0 line-clamp-3 min-h-[69px]"
                  style={{
                    fontFamily: "var(--font-geist-sans), 'Geist', sans-serif",
                    fontWeight: 400,
                    fontSize: "14px",
                    lineHeight: "23px",
                    color: "#737373",
                  }}
                >
                  {campaign.excerpt}
                </p>

                {/* Spacer: pushes author + stats to bottom for consistent row alignment */}
                <div className="flex-1 min-h-0" aria-hidden="true" />

                {/* Author row - fixed height for row alignment */}
                <div
                  className="flex items-center gap-3 pt-4 border-t border-[#E5E5E5] shrink-0"
                  style={{ minHeight: "57px" }}
                >
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
                    style={{
                      background: "#F5F5F5",
                      fontFamily: "var(--font-geist-sans), 'Geist', sans-serif",
                      fontWeight: 500,
                      fontSize: "12px",
                      lineHeight: "16px",
                      color: "#0A0A0A",
                    }}
                  >
                      {campaign.author.avatar}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p
                      className="truncate"
                      style={{
                        fontFamily: "var(--font-geist-sans), 'Geist', sans-serif",
                        fontWeight: 500,
                        fontSize: "14px",
                        lineHeight: "20px",
                        color: "#0A0A0A",
                      }}
                    >
                      {campaign.author.name}
                    </p>
                    <p
                      className="truncate"
                      style={{
                        fontFamily: "var(--font-geist-sans), 'Geist', sans-serif",
                        fontWeight: 400,
                        fontSize: "12px",
                        lineHeight: "16px",
                        color: "#737373",
                      }}
                    >
                      {campaign.author.handle}
                    </p>
                  </div>
                  <span
                    className="shrink-0"
                    style={{
                      fontFamily: "var(--font-geist-sans), 'Geist', sans-serif",
                      fontWeight: 400,
                      fontSize: "12px",
                      lineHeight: "16px",
                      color: "#737373",
                    }}
                  >
                    {campaign.date}
                  </span>
                </div>

                {/* Engagement stats - fixed height for row alignment */}
                <div className="flex items-center gap-6 mt-4 pt-2 shrink-0" style={{ minHeight: "32px" }}>
                  <div className="flex items-center gap-1.5">
                    <Heart className="w-3.5 h-3.5 shrink-0" strokeWidth={1.16667} style={{ color: "#737373" }} />
                    <span
                      style={{
                        fontFamily: "var(--font-geist-sans), 'Geist', sans-serif",
                        fontWeight: 400,
                        fontSize: "12px",
                        lineHeight: "16px",
                        color: "#737373",
                      }}
                    >
                      {campaign.stats.likes}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MessageCircle className="w-3.5 h-3.5 shrink-0" strokeWidth={1.16667} style={{ color: "#737373" }} />
                    <span
                      style={{
                        fontFamily: "var(--font-geist-sans), 'Geist', sans-serif",
                        fontWeight: 400,
                        fontSize: "12px",
                        lineHeight: "16px",
                        color: "#737373",
                      }}
                    >
                      {campaign.stats.comments}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Repeat2 className="w-3.5 h-3.5 shrink-0" strokeWidth={1.16667} style={{ color: "#737373" }} />
                    <span
                      style={{
                        fontFamily: "var(--font-geist-sans), 'Geist', sans-serif",
                        fontWeight: 400,
                        fontSize: "12px",
                        lineHeight: "16px",
                        color: "#737373",
                      }}
                    >
                      {campaign.stats.shares}
                    </span>
                  </div>
                  <Bookmark className="w-3.5 h-3.5 ml-auto shrink-0" strokeWidth={1.16667} style={{ color: "#0A0A0A" }} />
                  </div>
                </div>
              </a>
          ))}
        </div>
      </div>
    </section>
  )
}
