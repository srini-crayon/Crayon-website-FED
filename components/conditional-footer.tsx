"use client"

import { usePathname } from "next/navigation"
import { CrayonFooter } from "./crayon-footer"

/** Crayon footer is used app-wide; hidden only on agents chat page. */
export function ConditionalFooter() {
  const pathname = usePathname()
  if (pathname === "/agents/chat") {
    return null
  }
  return <CrayonFooter />
}
