import Link from "next/link"

export function SiteFooter() {
  return (
    <footer className="border-t bg-white">
      <div className="mx-auto max-w-6xl px-6 py-8">
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
          <p className="text-sm text-gray-600">© {new Date().getFullYear()} HydroSphere. All rights reserved.</p>
          <nav aria-label="Footer" className="flex items-center gap-4 text-sm">
            <Link href="/" className="text-gray-700 hover:text-black">
              Home
            </Link>
            <Link href="/map" className="text-gray-700 hover:text-black">
              Map
            </Link>
            <Link href="/top-cities" className="text-gray-700 hover:text-black">
              Top Cities
            </Link>
            <Link href="/simulate" className="text-gray-700 hover:text-black">
              Simulator
            </Link>
            <Link href="/learn" className="text-gray-700 hover:text-black">
              Learn
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  )
}

export default SiteFooter
