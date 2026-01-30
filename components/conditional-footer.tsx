"use client"

import { usePathname } from "next/navigation"
import { Footer } from "./footer"
import { CrayonFooter } from "./crayon-footer"

export function ConditionalFooter() {
  const pathname = usePathname()
  
  // Hide footer on agents chat page
  if (pathname === "/agents/chat") {
    return null
  }

  // Use crayon-footer on crayondata, tangram-ai, tangram-ai-isv, tangram-ai-reseller, blog, podcast, privacy-policy, cookie-policy, security-policy, terms-of-use, trust-center, privacy-civil-liberties, our-story, our-investors, our-values, vision, our-team, career, enquiry, agents-store, x, and linkedin pages
  if (pathname === "/crayondata" || pathname === "/tangram-ai" || pathname === "/tangram-ai-isv" || pathname === "/tangram-ai-reseller" || pathname === "/blog" || pathname === "/podcast" || pathname === "/privacy-policy" || pathname === "/cookie-policy" || pathname === "/security-policy" || pathname === "/terms-of-use" || pathname === "/trust-center" || pathname === "/privacy-civil-liberties" || pathname === "/our-story" || pathname === "/our-investors" || pathname === "/our-values" || pathname === "/vision" || pathname === "/our-team" || pathname === "/career" || pathname === "/enquiry" || pathname === "/agents-store" || pathname === "/x" || pathname === "/linkedin" || pathname === "/catalyst") {
    return <CrayonFooter />
  }

  return <Footer />
}
