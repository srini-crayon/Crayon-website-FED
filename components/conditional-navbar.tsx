"use client"

import { usePathname } from "next/navigation"
import { Navbar } from "./navbar"
import { CrayonHeader } from "./crayon-header"

export function ConditionalNavbar() {
  const pathname = usePathname()
  
  // Use crayon-header on Crayon marketing + Tangram pages (including Agents pages)
  if (
    pathname === "/" ||
    pathname === "/crayondata" ||
    pathname === "/tangram-ai" ||
    pathname === "/tangram-ai-isv" ||
    pathname === "/tangram-ai-reseller" ||
    pathname === "/tangram-ai-agents" ||
    pathname === "/blog" ||
    pathname === "/podcast" ||
    pathname === "/privacy-policy" ||
    pathname === "/cookie-policy" ||
    pathname === "/security-policy" ||
    pathname === "/terms-of-use" ||
    pathname === "/trust-center" ||
    pathname === "/privacy-civil-liberties" ||
    pathname === "/our-story" ||
    pathname === "/our-investors" ||
    pathname === "/our-values" ||
    pathname === "/vision" ||
    pathname === "/our-team" ||
    pathname === "/career" ||
    pathname === "/enquiry" ||
    pathname === "/agents-store" ||
    pathname === "/x" ||
    pathname === "/linkedin" ||
    pathname === "/catalyst" ||
    pathname === "/agents" ||
    pathname.startsWith("/agents/")
  ) {
    return <CrayonHeader />
  }

  return <Navbar />
}
