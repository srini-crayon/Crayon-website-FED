"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border transition-[top] duration-150 ease-out header-with-banner">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[oklch(0.55_0.2_260)] to-[oklch(0.65_0.2_175)] flex items-center justify-center shadow-md">
              <span className="text-white font-bold text-sm">CD</span>
            </div>
            <span className="font-semibold text-lg text-foreground">Crayon Data</span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            <Link href="#products" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Products
            </Link>
            <Link href="#solutions" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Solutions
            </Link>
            <Link href="#about" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              About
            </Link>
            <Link href="#clients" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Clients
            </Link>
          </nav>

          <div className="hidden md:flex items-center gap-4">
            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
              Sign In
            </Button>
            <Button size="sm" className="bg-gradient-to-r from-[oklch(0.55_0.2_260)] to-[oklch(0.65_0.2_175)] text-white hover:opacity-90 shadow-sm">
              Talk to Us
            </Button>
          </div>

          <button
            className="md:hidden p-2 text-muted-foreground hover:text-foreground"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {isOpen && (
          <div className="md:hidden py-4 border-t border-border">
            <nav className="flex flex-col gap-4">
              <Link href="#products" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Products
              </Link>
              <Link href="#solutions" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Solutions
              </Link>
              <Link href="#about" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                About
              </Link>
              <Link href="#clients" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Clients
              </Link>
              <div className="flex flex-col gap-2 pt-4 border-t border-border">
                <Button variant="ghost" size="sm" className="justify-start text-muted-foreground">
                  Sign In
                </Button>
                <Button size="sm" className="bg-gradient-to-r from-[oklch(0.55_0.2_260)] to-[oklch(0.65_0.2_175)] text-white hover:opacity-90">
                  Talk to Us
                </Button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
