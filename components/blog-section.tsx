"use client"

import { useState } from "react"
import { ArrowUpRight, Clock } from "lucide-react"

const blogPosts = [
  {
    number: "01",
    category: "AI Strategy",
    title: "From AI Pilots to Production: The Enterprise Playbook",
    excerpt:
      "Most enterprises struggle to move AI from proof-of-concept to production. Here's the framework that successful companies use.",
    author: "Suresh Shankar",
    date: "Jan 28, 2026",
    readTime: "8 min",
  },
  {
    number: "02",
    category: "Product Update",
    title: "Introducing Tangram 3.0: AI Agents for Enterprise",
    excerpt:
      "Our latest release brings autonomous AI agents that can reason, plan, and execute complex business workflows.",
    author: "Product Team",
    date: "Jan 22, 2026",
    readTime: "5 min",
  },
  {
    number: "03",
    category: "Industry Insights",
    title: "The Future of Personalization in Banking",
    excerpt:
      "How leading banks are using AI to deliver hyper-personalized experiences at scale while maintaining compliance.",
    author: "Research Team",
    date: "Jan 15, 2026",
    readTime: "6 min",
  },
  {
    number: "04",
    category: "Technical Deep Dive",
    title: "Building Scalable AI Infrastructure with Catalyst",
    excerpt:
      "A technical look at how Catalyst handles billions of transactions while maintaining sub-second latency.",
    author: "Engineering Team",
    date: "Jan 10, 2026",
    readTime: "10 min",
  },
]

export function BlogSection() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  return (
    <section className="py-24 bg-background">
      <div className="max-w-6xl mx-auto px-4">
        {/* Minimal header */}
        <div className="flex items-end justify-between mb-12">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-[1px] bg-foreground/40 dark:bg-foreground/50" />
              <span className="text-xs font-mono text-foreground/70 dark:text-foreground/80 tracking-widest uppercase">
                Spotlight
              </span>
            </div>
            <h2 className="text-2xl md:text-3xl font-light mt-2">
              <span className="bg-gradient-to-r from-[oklch(0.65_0.2_175)] to-[oklch(0.65_0.2_330)] bg-clip-text text-transparent">
                Fresh from the
              </span>
              <span className="font-medium text-foreground"> Blog</span>
            </h2>
          </div>
          <a
            href="#"
            className="group flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <span>All posts</span>
            <ArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>
        </div>

        {/* Vertical card grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {blogPosts.map((post, index) => {
            const accentColors = [
              "oklch(0.55 0.2 260)", // Purple
              "oklch(0.65 0.2 175)", // Teal
              "oklch(0.65 0.2 330)", // Pink
              "oklch(0.7 0.18 75)",  // Orange
            ]
            const accentColor = accentColors[index % accentColors.length]
            
            return (
            <div
              key={index}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              className="group relative bg-background border border-border p-6 cursor-pointer transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-[0_8px_30px_-12px_rgba(0,0,0,0.1)]"
              style={{
                borderColor: hoveredIndex === index ? accentColor : undefined
              }}
            >
              {/* Top accent line */}
              <div
                className="absolute top-0 left-0 h-[2px] transition-all duration-500 ease-out"
                style={{
                  width: hoveredIndex === index ? "100%" : "20%",
                  backgroundColor: accentColor
                }}
              />

              {/* Number & Category */}
              <div className="flex items-center justify-between mb-6">
                <span 
                  className="text-[10px] font-mono tracking-widest"
                  style={{
                    color: accentColor
                  }}
                >
                  {post.number}
                </span>
                <span
                  className="text-[9px] font-mono tracking-wider uppercase px-2 py-1 border border-border text-muted-foreground"
                >
                  {post.category}
                </span>
              </div>

              {/* Title */}
              <h3
                className="text-sm font-medium leading-snug mb-3 transition-colors duration-300 line-clamp-2 min-h-[40px]"
                style={{
                  color: accentColor
                }}
              >
                {post.title}
              </h3>

              {/* Excerpt */}
              <p className="text-xs text-foreground/70 dark:text-foreground/80 leading-relaxed mb-6 line-clamp-3 min-h-[48px]">
                {post.excerpt}
              </p>

              {/* Divider */}
              <div className="border-t border-border/50 pt-4">
                {/* Meta row */}
                <div className="flex items-center justify-between text-[10px] text-muted-foreground mb-3">
                  <span>{post.author}</span>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>{post.readTime}</span>
                  </div>
                </div>

                {/* Date & Arrow */}
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-muted-foreground/60">{post.date}</span>
                  <ArrowUpRight
                    className="w-4 h-4 transition-all duration-300"
                    style={{
                      color: accentColor,
                      transform: hoveredIndex === index ? "translate(2px, -2px)" : undefined
                    }}
                  />
                </div>
              </div>
            </div>
            )
          })}
        </div>

      </div>
    </section>
  )
}
