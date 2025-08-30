"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import Image from "next/image"

const links = [
  { href: "/", label: "Home" },
  { href: "/map", label: "Map" },
  { href: "/top-cities", label: "Top Cities" },
  { href: "/simulate", label: "Simulator" },
  { href: "/learn", label: "Learn" },
]

export function SiteHeader() {
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-40 w-full bg-transparent">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-2 rounded-full border border-white/20 bg-white/10 backdrop-blur-md shadow-sm dark:border-white/10 dark:bg-white/5">
        <Link href="/" aria-label="HydroSphere home" className="flex items-center">
          <Image
            src="/images/logo-dark.png"
            alt="HydroSphere logo"
            width={28}
            height={28}
            priority
            className="h-7 w-auto"
          />
        </Link>

        <nav aria-label="Main navigation">
          <ul className="flex items-center gap-3">
            {links.map((link) => {
              const active = pathname === link.href || (link.href !== "/" && pathname?.startsWith(link.href))
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "rounded px-2 py-1 text-sm transition-colors",
                      active ? "bg-primary/10 text-primary" : "text-foreground/80 hover:text-foreground",
                    )}
                  >
                    {link.label}
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>
      </div>
    </header>
  )
}
