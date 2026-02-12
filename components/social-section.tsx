"use client"

import { useState } from "react"
import Image from "next/image"
import { ArrowUpRight, ExternalLink, Heart, MessageCircle, Repeat2, Bookmark } from "lucide-react"

const LinkedInIcon = () => (
  <svg className="w-4 h-4 text-muted-foreground group-hover:text-[#0077b5] transition-colors duration-300" viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
)

const XIcon = () => (
  <svg className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors duration-300" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
)

const campaigns = [
  {
    id: 1,
    platform: "linkedin" as const,
    type: "Tribute",
    title: "A Tribute to Tim Kobe: A Visionary and a Friend",
    description: "Last week, Crayon Data lost a titan, a partner, and a dear friend. Tim Kobe didn't just design stores or marketplaces; he designed the way we experience the world. He helped us find the 'human' inside the data and pushed us to focus on creating relevance and meaning.",
    image: "/img/tim-kobe-portrait.png",
    link: "https://www.linkedin.com/company/crayondata",
    author: {
      name: "Suresh V Shankar",
      handle: "@sureshshankar",
      avatar: "S",
    },
    stats: {
      likes: "7",
      comments: "12",
      shares: "3",
    },
    date: "2d ago",
    tags: ["Tribute", "Tim Kobe", "Design"],
  },
]

export function SocialSection() {
  const [hoveredId, setHoveredId] = useState<number | null>(null)

  return (
    <section className="py-24 bg-background">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-16">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-[1px] bg-foreground/40 dark:bg-foreground/50" />
              <span className="text-xs font-mono text-foreground/70 dark:text-foreground/80 tracking-widest uppercase">
                Social
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl font-light">
              <span className="bg-gradient-to-r from-[oklch(0.65_0.2_330)] to-[oklch(0.7_0.18_75)] bg-clip-text text-transparent">
                Just In —
              </span>
              <span className="font-medium text-foreground"> From Our World</span>
            </h2>
          </div>
          
          <div className="flex gap-4">
            <a
              href="https://linkedin.com/company/crayondata"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-2 px-4 py-2 border border-border hover:border-accent/50 transition-all duration-300"
            >
              <LinkedInIcon />
              <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">Follow</span>
              <ArrowUpRight className="w-3 h-3 text-muted-foreground group-hover:text-accent transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
            <a
              href="https://x.com/crayondata"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-2 px-4 py-2 border border-border hover:border-accent/50 transition-all duration-300"
            >
              <XIcon />
              <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">Follow</span>
              <ArrowUpRight className="w-3 h-3 text-muted-foreground group-hover:text-accent transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
          </div>
        </div>

        {/* Campaign Card - small rectangle: captions left, image right */}
        <div className="flex justify-center">
            {campaigns.map((campaign, index) => {
              const accentColors = [
                "oklch(0.55 0.2 260)", // Purple
                "oklch(0.65 0.2 175)", // Teal
                "oklch(0.65 0.2 330)", // Pink
              ]
              const accentColor = accentColors[index % accentColors.length]
              
              return (
              <a
                key={campaign.id}
                href={campaign.link}
                target="_blank"
                rel="noopener noreferrer"
                onMouseEnter={() => setHoveredId(campaign.id)}
                onMouseLeave={() => setHoveredId(null)}
                className="group relative flex w-full max-w-2xl bg-background border transition-all duration-500 hover:-translate-y-0.5 hover:shadow-[0_12px_40px_-16px_rgba(0,0,0,0.1)]"
                style={{
                  borderColor: hoveredId === campaign.id ? accentColor : undefined
                }}
              >
                {/* Top accent line */}
                <div
                  className="absolute top-0 left-0 h-[2px] transition-all duration-500 ease-out"
                  style={{
                    width: hoveredId === campaign.id ? "100%" : "0%",
                    backgroundColor: accentColor
                  }}
                />

                {/* Left - Captions */}
                <div className="flex-1 min-w-0 p-4 md:p-5 flex flex-col justify-center">
                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5 mb-2 opacity-100">
                    {campaign.tags.map((tag, i) => (
                      <span 
                        key={i}
                        className="text-[10px] font-mono px-2 py-0.5 border border-border text-muted-foreground opacity-100"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Title */}
                  <h3 
                    className="text-sm font-medium text-foreground mb-1.5 transition-colors duration-300 line-clamp-2"
                    style={{
                      color: hoveredId === campaign.id ? accentColor : undefined
                    }}
                  >
                    {campaign.title}
                  </h3>

                  {/* Description */}
                  <p className="text-xs text-muted-foreground leading-relaxed mb-3 line-clamp-2">
                    {campaign.description}
                  </p>

                  {/* Author + Date */}
                  <div className="flex items-center gap-2 mb-3 pb-3 border-b border-border/50">
                    <div className="w-6 h-6 bg-muted flex items-center justify-center text-[10px] font-medium text-foreground">
                      {campaign.author.avatar}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-medium text-foreground truncate">{campaign.author.name}</p>
                      <p className="text-[10px] text-muted-foreground truncate">{campaign.author.handle}</p>
                    </div>
                    <span className="ml-auto text-[10px] text-muted-foreground shrink-0">{campaign.date}</span>
                  </div>

                  {/* Engagement Stats */}
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Heart className="w-3 h-3" style={{ color: hoveredId === campaign.id ? accentColor : undefined }} />
                      <span className="text-[10px]">{campaign.stats.likes}</span>
                    </div>
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <MessageCircle className="w-3 h-3" style={{ color: hoveredId === campaign.id ? accentColor : undefined }} />
                      <span className="text-[10px]">{campaign.stats.comments}</span>
                    </div>
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Repeat2 className="w-3 h-3" style={{ color: hoveredId === campaign.id ? accentColor : undefined }} />
                      <span className="text-[10px]">{campaign.stats.shares}</span>
                    </div>
                    <Bookmark className="w-3 h-3 ml-auto" style={{ color: hoveredId === campaign.id ? accentColor : undefined }} />
                  </div>
                </div>

                {/* Right - Image */}
                <div className="relative w-32 sm:w-40 md:w-44 shrink-0 aspect-[4/3] bg-muted/30 overflow-hidden">
                  {campaign.image && campaign.image !== "/api/placeholder/400/240" ? (
                    <Image
                      src={campaign.image}
                      alt={campaign.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 128px, (max-width: 768px) 160px, 176px"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent" />
                  )}
                  {/* Platform Badge */}
                  <div className="absolute top-2 left-2 flex items-center gap-1.5 px-2 py-1 bg-background/90 backdrop-blur-sm border border-border/50 z-10">
                    {campaign.platform === "linkedin" ? <LinkedInIcon /> : <XIcon />}
                    <span className="text-[9px] font-mono text-muted-foreground uppercase tracking-wider">
                      {campaign.type}
                    </span>
                  </div>
                  <div 
                    className={`absolute top-2 right-2 p-1.5 bg-background/90 backdrop-blur-sm border border-border/50 transition-all duration-300 z-10 ${
                      hoveredId === campaign.id ? "opacity-100 translate-x-0" : "opacity-0 translate-x-1"
                    }`}
                  >
                    <ExternalLink className="w-2.5 h-2.5 text-foreground" />
                  </div>
                </div>
              </a>
              )
            })}
        </div>

      </div>
    </section>
  )
}
