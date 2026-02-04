"use client"

import { useEffect, useState } from "react"
import { Shield, Sparkles, Zap, BarChart3, Users, Globe, Cpu, Database } from "lucide-react"

export function SlideIllustration({ slideIndex, isActive }: { slideIndex: number; isActive: boolean }) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    if (isActive) {
      setMounted(true)
    } else {
      setMounted(false)
    }
  }, [isActive])

  // Slide 1: AI Platform - Central hub with floating cards
  if (slideIndex === 0) {
    const cards = [
      { label: 'Data Secured', icon: Shield, color: '#14b8a6', position: 'top-4 left-8' },
      { label: 'Customisation', icon: Zap, color: '#6366f1', position: 'top-12 right-4' },
      { label: 'Reply with AI', icon: Sparkles, color: '#ec4899', position: 'bottom-16 left-4' },
      { label: 'Analytics', icon: BarChart3, color: '#f97316', position: 'bottom-8 right-12' },
    ]
    
    return (
      <div className="relative w-80 h-80 flex items-center justify-center">
        {/* Dotted circle */}
        <svg className="absolute inset-0 w-full h-full">
          <circle
            cx="160"
            cy="160"
            r="120"
            fill="none"
            stroke="#e5e7eb"
            strokeWidth="2"
            strokeDasharray="4 6"
            style={{
              opacity: mounted ? 1 : 0,
              transitionProperty: 'opacity',
              transitionDuration: '0.6s',
              transitionTimingFunction: 'ease-out'
            }}
          />
        </svg>
        
        {/* Center button */}
        <div 
          className="relative z-10 bg-foreground text-background px-6 py-3 rounded-lg shadow-xl"
          style={{
            opacity: mounted ? 1 : 0,
            transform: mounted ? 'scale(1)' : 'scale(0.9)',
            transitionProperty: 'opacity, transform',
            transitionDuration: '0.5s',
            transitionTimingFunction: 'ease-out',
            transitionDelay: '0.2s'
          }}
        >
          <span className="font-medium text-sm">Create Agent</span>
          {/* Gradient underline */}
          <div 
            className="absolute bottom-0 left-0 right-0 h-1 rounded-b-lg"
            style={{ background: 'linear-gradient(to right, #ec4899, #f97316)' }}
          />
        </div>
        
        {/* Floating cards */}
        {cards.map((card, i) => (
          <div
            key={i}
            className={`absolute ${card.position} bg-background border border-border rounded-xl px-4 py-3 shadow-lg flex items-center gap-2`}
            style={{
              opacity: mounted ? 1 : 0,
              transform: mounted ? 'translateY(0)' : 'translateY(10px)',
              transitionProperty: 'opacity, transform',
              transitionDuration: '0.5s',
              transitionTimingFunction: 'ease-out',
              transitionDelay: `${0.3 + i * 0.1}s`
            }}
          >
            <div 
              className="w-6 h-6 rounded flex items-center justify-center"
              style={{ backgroundColor: card.color }}
            >
              <card.icon className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="text-xs font-medium text-foreground">{card.label}</span>
          </div>
        ))}
        
        {/* Toggle switch */}
        <div 
          className="absolute bottom-4 right-4 bg-background border border-border rounded-xl px-3 py-2 shadow-lg"
          style={{
            opacity: mounted ? 1 : 0,
            transform: mounted ? 'translateY(0)' : 'translateY(10px)',
            transitionProperty: 'opacity, transform',
            transitionDuration: '0.5s',
            transitionTimingFunction: 'ease-out',
            transitionDelay: '0.7s'
          }}
        >
          <div className="w-10 h-5 bg-orange-400 rounded-full relative">
            <div className="absolute right-0.5 top-0.5 w-4 h-4 bg-white rounded-full shadow" />
          </div>
        </div>
      </div>
    )
  }

  // Slide 2: Tangram - Clean layered interface cards
  if (slideIndex === 1) {
    const layers = [
      { title: 'User Context', desc: 'Behavioral patterns', color: '#14b8a6' },
      { title: 'Intent Analysis', desc: 'Real-time signals', color: '#6366f1' },
      { title: 'Recommendations', desc: 'Personalized offers', color: '#ec4899' },
    ]
    
    return (
      <div className="relative w-80 h-80 flex items-center justify-center">
        {/* Dotted arc */}
        <svg className="absolute inset-0 w-full h-full">
          <path
            d="M 40 160 Q 160 40 280 160"
            fill="none"
            stroke="#e5e7eb"
            strokeWidth="2"
            strokeDasharray="4 6"
            style={{
              opacity: mounted ? 1 : 0,
              transitionProperty: 'opacity',
              transitionDuration: '0.6s',
              transitionTimingFunction: 'ease-out'
            }}
          />
        </svg>
        
        {/* Stacked cards */}
        <div className="relative">
          {layers.map((layer, i) => (
            <div
              key={i}
              className="bg-background border border-border rounded-xl p-4 shadow-lg mb-3 w-56"
              style={{
                opacity: mounted ? 1 : 0,
                transform: mounted ? 'translateX(0)' : `translateX(${-20 + i * 10}px)`,
                transitionProperty: 'opacity, transform',
                transitionDuration: '0.5s',
                transitionTimingFunction: 'ease-out',
                transitionDelay: `${0.2 + i * 0.15}s`
              }}
            >
              <div className="flex items-center gap-3">
                <div 
                  className="w-2 h-8 rounded-full"
                  style={{ backgroundColor: layer.color }}
                />
                <div>
                  <div className="text-sm font-medium text-foreground">{layer.title}</div>
                  <div className="text-xs text-muted-foreground">{layer.desc}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Connection indicator */}
        <div 
          className="absolute top-8 right-8 flex items-center gap-2"
          style={{
            opacity: mounted ? 1 : 0,
            transitionProperty: 'opacity',
            transitionDuration: '0.5s',
            transitionTimingFunction: 'ease-out',
            transitionDelay: '0.7s'
          }}
        >
          <Cpu className="w-4 h-4 text-muted-foreground" />
          <span className="text-xs text-muted-foreground">Processing</span>
        </div>
      </div>
    )
  }

  // Slide 3: Catalyst - Clean metrics dashboard
  if (slideIndex === 2) {
    const stats = [
      { value: '10x', label: 'Faster', color: '#14b8a6' },
      { value: '99.9%', label: 'Uptime', color: '#6366f1' },
      { value: '50M+', label: 'Events/day', color: '#ec4899' },
    ]
    
    return (
      <div className="relative w-80 h-80 flex items-center justify-center">
        {/* Dotted circle */}
        <svg className="absolute inset-0 w-full h-full">
          <circle
            cx="160"
            cy="160"
            r="130"
            fill="none"
            stroke="#e5e7eb"
            strokeWidth="2"
            strokeDasharray="4 6"
            style={{
              opacity: mounted ? 1 : 0,
              transitionProperty: 'opacity',
              transitionDuration: '0.6s',
              transitionTimingFunction: 'ease-out'
            }}
          />
        </svg>
        
        {/* Main dashboard card */}
        <div 
          className="bg-background border border-border rounded-2xl p-6 shadow-xl"
          style={{
            opacity: mounted ? 1 : 0,
            transform: mounted ? 'scale(1)' : 'scale(0.95)',
            transitionProperty: 'opacity, transform',
            transitionDuration: '0.5s',
            transitionTimingFunction: 'ease-out',
            transitionDelay: '0.2s'
          }}
        >
          <div className="flex items-center gap-2 mb-4">
            <Database className="w-4 h-4 text-muted-foreground" />
            <span className="text-xs text-muted-foreground font-medium">Execution Engine</span>
          </div>
          
          <div className="flex gap-6">
            {stats.map((stat, i) => (
              <div 
                key={i} 
                className="text-center"
                style={{
                  opacity: mounted ? 1 : 0,
                  transform: mounted ? 'translateY(0)' : 'translateY(10px)',
                  transitionProperty: 'opacity, transform',
                  transitionDuration: '0.4s',
                  transitionTimingFunction: 'ease-out',
                  transitionDelay: `${0.4 + i * 0.1}s`
                }}
              >
                <div 
                  className="text-2xl font-bold"
                  style={{ color: stat.color }}
                >
                  {stat.value}
                </div>
                <div className="text-[10px] text-muted-foreground mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
          
          {/* Progress bar */}
          <div className="mt-4 h-1.5 bg-muted rounded-full overflow-hidden">
            <div 
              className="h-full rounded-full"
              style={{
                width: mounted ? '75%' : '0%',
                background: 'linear-gradient(to right, #14b8a6, #6366f1)',
                transitionProperty: 'width',
                transitionDuration: '1s',
                transitionTimingFunction: 'ease-out',
                transitionDelay: '0.6s'
              }}
            />
          </div>
        </div>
        
        {/* Floating badges */}
        <div 
          className="absolute top-8 left-4 bg-background border border-border rounded-lg px-3 py-1.5 shadow-md flex items-center gap-2"
          style={{
            opacity: mounted ? 1 : 0,
            transform: mounted ? 'translateY(0)' : 'translateY(-10px)',
            transitionProperty: 'opacity, transform',
            transitionDuration: '0.5s',
            transitionTimingFunction: 'ease-out',
            transitionDelay: '0.8s'
          }}
        >
          <div className="w-2 h-2 rounded-full bg-green-500" />
          <span className="text-[10px] text-muted-foreground">Live</span>
        </div>
        
        <div 
          className="absolute bottom-12 right-4 bg-background border border-border rounded-lg px-3 py-1.5 shadow-md"
          style={{
            opacity: mounted ? 1 : 0,
            transform: mounted ? 'translateY(0)' : 'translateY(10px)',
            transitionProperty: 'opacity, transform',
            transitionDuration: '0.5s',
            transitionTimingFunction: 'ease-out',
            transitionDelay: '0.9s'
          }}
        >
          <span className="text-[10px] font-medium" style={{ color: '#14b8a6' }}>Scaled</span>
        </div>
      </div>
    )
  }

  // Slide 4: Impact - Clean stats with orbiting elements
  if (slideIndex === 3) {
    const orbitItems = [
      { icon: Users, label: 'Users', position: 'top-2 left-1/2 -translate-x-1/2' },
      { icon: Globe, label: 'Global', position: 'right-2 top-1/2 -translate-y-1/2' },
      { icon: Zap, label: 'Fast', position: 'bottom-2 left-1/2 -translate-x-1/2' },
      { icon: Shield, label: 'Secure', position: 'left-2 top-1/2 -translate-y-1/2' },
    ]
    
    return (
      <div className="relative w-80 h-80 flex items-center justify-center">
        {/* Dotted circles */}
        <svg className="absolute inset-0 w-full h-full">
          <circle
            cx="160"
            cy="160"
            r="140"
            fill="none"
            stroke="#e5e7eb"
            strokeWidth="2"
            strokeDasharray="4 6"
            style={{
              opacity: mounted ? 1 : 0,
              transitionProperty: 'opacity',
              transitionDuration: '0.6s',
              transitionTimingFunction: 'ease-out'
            }}
          />
          <circle
            cx="160"
            cy="160"
            r="100"
            fill="none"
            stroke="#e5e7eb"
            strokeWidth="1"
            strokeDasharray="2 4"
            style={{
              opacity: mounted ? 0.5 : 0,
              transitionProperty: 'opacity',
              transitionDuration: '0.6s',
              transitionTimingFunction: 'ease-out',
              transitionDelay: '0.2s'
            }}
          />
        </svg>
        
        {/* Center stat card */}
        <div 
          className="bg-background border border-border rounded-2xl p-6 shadow-xl text-center relative z-10"
          style={{
            opacity: mounted ? 1 : 0,
            transform: mounted ? 'scale(1)' : 'scale(0.9)',
            transitionProperty: 'opacity, transform',
            transitionDuration: '0.5s',
            transitionTimingFunction: 'ease-out',
            transitionDelay: '0.3s'
          }}
        >
          <div 
            className="text-4xl font-bold bg-clip-text text-transparent"
            style={{ backgroundImage: 'linear-gradient(135deg, #14b8a6, #6366f1)' }}
          >
            117M+
          </div>
          <div className="text-xs text-muted-foreground mt-1">Users Reached</div>
          
          {/* Gradient underline */}
          <div 
            className="mt-3 h-1 rounded-full mx-auto"
            style={{
              width: mounted ? '60px' : '0px',
              background: 'linear-gradient(to right, #14b8a6, #6366f1)',
              transitionProperty: 'width',
              transitionDuration: '0.6s',
              transitionTimingFunction: 'ease-out',
              transitionDelay: '0.5s'
            }}
          />
        </div>
        
        {/* Orbiting items */}
        {orbitItems.map((item, i) => (
          <div
            key={i}
            className={`absolute ${item.position} bg-background border border-border rounded-xl px-3 py-2 shadow-md flex items-center gap-2`}
            style={{
              opacity: mounted ? 1 : 0,
              transitionProperty: 'opacity',
              transitionDuration: '0.5s',
              transitionTimingFunction: 'ease-out',
              transitionDelay: `${0.5 + i * 0.1}s`
            }}
          >
            <item.icon className="w-3.5 h-3.5 text-muted-foreground" />
            <span className="text-[10px] font-medium text-muted-foreground">{item.label}</span>
          </div>
        ))}
      </div>
    )
  }

  return null
}
