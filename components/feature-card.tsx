"use client"

import Link from "next/link"
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

type FeatureCardProps = {
  title: string
  description: string
  href: string
  cta?: string
}

export function FeatureCard({ title, description, href, cta = "Explore" }: FeatureCardProps) {
  return (
    <Card className="h-full transition-transform hover:-translate-y-0.5">
      <CardHeader>
        <CardTitle className="text-teal-700">{title}</CardTitle>
        <CardDescription className="text-pretty">{description}</CardDescription>
      </CardHeader>
      <div className="px-6 pb-6">
        <Button asChild>
          <Link href={href}>{cta}</Link>
        </Button>
      </div>
    </Card>
  )
}
