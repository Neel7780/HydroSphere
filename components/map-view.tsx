"use client"

import { useEffect, useState } from "react"
import dynamic from "next/dynamic"

// Create a client-only map component
const ClientMap = dynamic(() => import("./client-map"), {
  ssr: false,
  loading: () => <div className="h-[70vh] w-full rounded-md bg-gray-100" />
})

export function MapView() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <div className="h-[70vh] w-full rounded-md bg-gray-100" />
  }

  return <ClientMap />
}
