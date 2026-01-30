"use client"

import { useEffect } from "react"
import { HeroSection } from "@/components/banking/sections/hero-section"
import { TrendsSection } from "@/components/banking/sections/trends-section"
import { SolutionsSection } from "@/components/banking/sections/solutions-section"
import { CTASection } from "@/components/banking/sections/cta-section"

export default function BankingPage() {
  useEffect(() => {
    const scheduleObservation = (callback: () => void) => {
      if ("requestIdleCallback" in window) {
        requestIdleCallback(callback, { timeout: 200 })
      } else {
        setTimeout(callback, 100)
      }
    }

    const observerOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px",
    }

    const observer = new IntersectionObserver(
      (entries) => {
        requestAnimationFrame(() => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              if (entry.target.classList.contains("fade-in-section")) {
                entry.target.classList.add("fade-in-visible")
              } else if (entry.target.classList.contains("slide-in-left")) {
                entry.target.classList.add("slide-in-visible")
              } else if (entry.target.classList.contains("slide-in-right")) {
                entry.target.classList.add("slide-in-visible")
              } else if (entry.target.classList.contains("scale-in")) {
                entry.target.classList.add("scale-in-visible")
              } else if (entry.target.classList.contains("fade-in-blur")) {
                entry.target.classList.add("fade-in-blur-visible")
              } else if (entry.target.classList.contains("stagger-item")) {
                entry.target.classList.add("stagger-visible")
              }
              observer.unobserve(entry.target)
            }
          })
        })
      },
      observerOptions
    )

    const observeElements = () => {
      const animatedElements = document.querySelectorAll(
        ".fade-in-section, .slide-in-left, .slide-in-right, .scale-in, .fade-in-blur, .stagger-item"
      )
      animatedElements.forEach((el) => observer.observe(el))
    }

    const reobserveStaggerItems = () => {
      requestAnimationFrame(() => {
        document.querySelectorAll(".stagger-item:not(.stagger-visible)").forEach((el) => observer.observe(el))
      })
    }

    scheduleObservation(observeElements)

    const onReobserve = () => reobserveStaggerItems()
    window.addEventListener("banking-reobserve", onReobserve)

    return () => {
      window.removeEventListener("banking-reobserve", onReobserve)
      const animatedElements = document.querySelectorAll(
        ".fade-in-section, .slide-in-left, .slide-in-right, .scale-in, .fade-in-blur, .stagger-item"
      )
      animatedElements.forEach((el) => observer.unobserve(el))
      observer.disconnect()
    }
  }, [])

  return (
    <div className="flex flex-col min-h-screen" style={{ scrollBehavior: "smooth" }}>
      <HeroSection />
      <TrendsSection />
      <SolutionsSection />
      <CTASection />
    </div>
  )
}
