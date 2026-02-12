"use client"

import Link from "next/link"
import { ArrowRight } from "lucide-react"

export function LiveWalkthroughSection() {
  return (
    <section className="py-24 md:py-32 bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="flex items-center justify-center gap-4 mb-6">
          <div className="w-8 h-[1px] bg-foreground/40 dark:bg-foreground/50" />
          <span className="text-xs font-mono text-foreground/70 dark:text-foreground/80 tracking-widest uppercase">
            No PowerPoint. Just Production.
          </span>
          <div className="w-8 h-[1px] bg-foreground/40 dark:bg-foreground/50" />
        </div>
        <p className="text-lg md:text-xl text-muted-foreground mb-6 italic">
          &ldquo;If you&apos;ve seen enough slides to last a lifetime, this invitation is for you.&rdquo;
        </p>
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-light tracking-tight mb-6">
          <span className="bg-gradient-to-r from-[oklch(0.55_0.25_260)] to-[oklch(0.65_0.25_330)] bg-clip-text text-transparent">
            60 minutes.
          </span>
          <span className="block font-medium text-foreground mt-2">
            No theoretical futures. No slide decks.
          </span>
        </h2>
        <p className="text-muted-foreground text-base md:text-lg max-w-2xl mx-auto mb-10">
          Just live agents running on real data. See how AI moves from the lab into core operations.
        </p>
        <Link
          href="/contact"
          className="inline-flex items-center justify-center gap-2 border border-border hover:bg-muted/50 rounded-[4px] px-8 py-4 font-medium text-foreground transition-all"
        >
          Schedule Your Live Walkthrough
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </section>
  )
}
