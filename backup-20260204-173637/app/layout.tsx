import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import Script from "next/script"
import { ConditionalNavbar } from "../components/conditional-navbar"
import { ConditionalFooter } from "../components/conditional-footer"
import { ModalProvider } from "../components/modal-provider"
import { DynamicFavicon } from "../components/dynamic-favicon"
import { LocalAuthInit } from "../components/local-auth-init"
import { NotificationBanner } from "../components/notification-banner"
import { Suspense } from "react"
import "./globals.css"

export const metadata: Metadata = {
  title: "Crayon Data - B2B AI Solutions for Enterprises",
  description: "Explore AI-powered solutions that deliver enterprise-grade outcomes",
  generator: "v0.app",
  icons: {
    icon: [
      { url: '/favicon.png', type: 'image/png' },
    ],
    shortcut: '/favicon.png',
    apple: '/favicon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        {/* Microsoft Clarity Analytics */}
        <Script
          id="microsoft-clarity"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function(c,l,a,r,i,t,y){
                  c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                  t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                  y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
              })(window, document, "clarity", "script", "ux2758orfu");
            `,
          }}
        />
      </head>
      <body
        suppressHydrationWarning
        className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}
      >
        <NotificationBanner />
        <Suspense fallback={<div>Loading...</div>}>
          <DynamicFavicon />
          <LocalAuthInit />
          <ConditionalNavbar />
          <main className="min-h-screen">{children}</main>
          <ConditionalFooter />
          <ModalProvider />
        </Suspense>
        <Analytics />
      </body>
    </html>
  )
}
