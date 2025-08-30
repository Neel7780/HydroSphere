import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { ChatbotWidget } from "@/components/chatbot-widget"
import { Suspense } from "react"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import "./globals.css"

export const metadata: Metadata = {
  title: "HydroSphere",
  description: "HydroSphere — Minimal, clean landing with features.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`min-h-screen font-sans ${GeistSans.variable} ${GeistMono.variable}`}
        style={{ backgroundColor: "#d5f4f9" }}
      >
        <SiteHeader />
        <Suspense fallback={null}>
          {children}
          <SiteFooter />
          <ChatbotWidget />
        </Suspense>
        <Analytics />
      </body>
    </html>
  )
}
