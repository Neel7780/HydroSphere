"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"

type Message = { role: "user" | "assistant"; text: string }

export function ChatbotWidget() {
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState("")
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", text: "Hi! I’m your energy site assistant. How can I help?" },
  ])
  const endRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, open])

  function send() {
    const text = input.trim()
    if (!text) return
    setMessages((m) => [...m, { role: "user", text }])
    setInput("")
    // mock reply
    setTimeout(() => {
      setMessages((m) => [
        ...m,
        {
          role: "assistant",
          text: "Thanks! I’m a demo assistant. Visit Top Cities or Simulator for interactive features.",
        },
      ])
    }, 500)
  }

  return (
    <>
      <button
        aria-label="Open assistant"
        onClick={() => setOpen(true)}
        className="fixed bottom-4 right-4 z-40 rounded-full bg-teal-600 px-4 py-3 text-white shadow-lg transition hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-amber-400"
      >
        Chat
      </button>

      {open && (
        <div className="fixed bottom-20 right-4 z-40 w-80 max-w-[90vw]">
          <Card className="grid max-h-[70vh] grid-rows-[auto_1fr_auto] overflow-hidden border-teal-600">
            <div className="flex items-center justify-between bg-teal-600 px-3 py-2 text-white">
              <div className="font-medium">Assistant</div>
              <Button size="sm" variant="secondary" onClick={() => setOpen(false)}>
                Close
              </Button>
            </div>
            <div className="flex flex-col gap-2 overflow-y-auto p-3">
              {messages.map((m, i) => (
                <div
                  key={i}
                  className={`rounded-md px-3 py-2 ${m.role === "user" ? "self-end bg-gray-900 text-white" : "self-start bg-gray-100"}`}
                >
                  {m.text}
                </div>
              ))}
              <div ref={endRef} />
            </div>
            <div className="grid gap-2 p-3">
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type a message"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault()
                    send()
                  }
                }}
              />
              <Button onClick={send}>Send</Button>
            </div>
          </Card>
        </div>
      )}
    </>
  )
}
