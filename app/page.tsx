"use client"

import { useEffect, useState, useRef } from "react"
import { StickyScrollRevealDemo } from "@/components/sticky-scroll-demo"
import { Footer } from "@/components/footer"

export default function Page() {
  const [mounted, setMounted] = useState(false)
  const lampRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setMounted(true)
    
    const handleMouseMove = (e: MouseEvent) => {
      if (!lampRef.current) return
      
      const x = (e.clientX / window.innerWidth) * 100
      const y = (e.clientY / window.innerHeight) * 100
      
      document.documentElement.style.setProperty('--mouse-x', `${x}%`)
      document.documentElement.style.setProperty('--mouse-y', `${y}%`)
    }
    
    document.addEventListener('mousemove', handleMouseMove)
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
    }
  }, [])

  return (
    <>
      <div ref={lampRef} className="lamp-effect" />
      <main className="relative min-h-screen bg-black overflow-hidden">
        <div className="relative w-full min-h-screen flex flex-col items-center justify-center">
          {mounted && (
            <>
              <h1 className="font-bold text-green-400 z-10 animated-title title-positioning" style={{ fontSize: '120px' }}>
                HYDROSPHERE
              </h1>
              <button 
                type="button" 
                className="z-10 animated-button hover-border-gradient button-positioning"
                onClick={() => {
                  const section = document.getElementById('sticky-scroll-section');
                  if (section) {
                    section.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
              >
                Visit
              </button>
            </>
          )}
        </div>
      </main>

      <StickyScrollRevealDemo />

      <Footer />

      <style jsx global>{`
        :root {
          --mouse-x: 50%;
          --mouse-y: 50%;
        }
        
        body {
          margin: 0;
          background: #000;
          overflow-x: hidden;
        }
        
        /* Hide scrollbars completely */
        * {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        
        *::-webkit-scrollbar {
          display: none;
          width: 0;
          height: 0;
        }
        
        html, body {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        
        html::-webkit-scrollbar, body::-webkit-scrollbar {
          display: none;
          width: 0;
          height: 0;
        }
        
        /* Title animation - starts invisible */
        .animated-title {
          opacity: 0;
          visibility: hidden;
          animation: slideUpTitle 1s ease-out 0s forwards;
        }
        
        .title-positioning {
          margin-bottom: 0;
        }
        
        /* Button animation - starts invisible */
        .animated-button {
          opacity: 0;
          visibility: hidden;
          animation: slideDownButton 1s ease-out 0s forwards;
        }
        
        /* Button positioning */
        .button-positioning {
          margin-top: 0;
        }
        
        /* Hover Border Gradient Button */
        .hover-border-gradient {
          position: relative;
          background: linear-gradient(90deg, #000, #000) padding-box,
                      linear-gradient(90deg, #22c55e, #16a34a, #15803d) border-box;
          border: 2px solid transparent;
          border-radius: 9999px;
          padding: 16px 40px;
          color: white;
          font-weight: 600;
          font-size: 20px;
          transition: all 0.3s ease;
          overflow: hidden;
        }
        
        .hover-border-gradient::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(90deg, #22c55e, #16a34a, #15803d, #22c55e);
          background-size: 200% 100%;
          border-radius: inherit;
          z-index: -1;
          transition: all 0.3s ease;
          animation: gradientShift 3s ease-in-out infinite;
        }
        
        .hover-border-gradient:hover::before {
          animation-duration: 0.8s;
        }
        
        .hover-border-gradient:hover {
          transform: scale(1.05);
          box-shadow: 0 0 20px rgba(34, 197, 94, 0.5);
        }
        
        @keyframes gradientShift {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }
        
        @keyframes slideUpTitle {
          0% {
            transform: translateY(50px);
            opacity: 0;
            visibility: visible;
          }
          1% {
            visibility: visible;
            opacity: 0;
          }
          100% {
            transform: translateY(0);
            opacity: 1;
            visibility: visible;
          }
        }
        
        @keyframes slideDownButton {
          0% {
            transform: translateY(-50px);
            margin-top: 0;
            opacity: 0;
            visibility: visible;
          }
          1% {
            visibility: visible;
            opacity: 0;
          }
          100% {
            transform: translateY(0);
            margin-top: 40px;
            opacity: 1;
            visibility: visible;
          }
        }
        
        .lamp-effect {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: 1;
        }
        
        .lamp-effect::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: radial-gradient(
            600px circle at var(--mouse-x) var(--mouse-y),
            rgba(0, 0, 0, 0) 0%,
            rgba(0, 0, 0, 0.3) 40%,
            rgba(0, 0, 0, 0.8) 100%
          );
        }
        
        .lamp-effect::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: radial-gradient(
            400px circle at var(--mouse-x) var(--mouse-y),
            rgba(34, 197, 94, 0.4) 0%,
            rgba(34, 197, 94, 0.1) 50%,
            transparent 100%
          );
          mix-blend-mode: screen;
        }
        
      `}</style>
    </>
  )
}
