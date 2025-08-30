"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Navigation } from "@/components/Navigation"
import { Send, Bot, User } from "lucide-react"

interface Message {
  id: string
  content: string
  sender: "user" | "bot"
  timestamp: Date
}

export default function ChatbotPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState("")
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
    setMessages([
      {
        id: "1",
        content: "Hello! I'm HydroBot, your hydrogen energy assistant. How can I help you today?",
        sender: "bot",
        timestamp: new Date()
      }
    ])
  }, [])

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      sender: "user",
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    const currentInput = inputValue
    setInputValue("")

    // Add loading message
    const loadingMessage: Message = {
      id: (Date.now() + 1).toString(),
      content: "Thinking...",
      sender: "bot",
      timestamp: new Date()
    }
    setMessages(prev => [...prev, loadingMessage])

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: currentInput }),
      })

      let data;
      try {
        data = await response.json()
      } catch (parseError) {
        console.error('JSON parse error:', parseError)
        throw new Error('Invalid response format')
      }

      // Remove loading message and add real response
      setMessages(prev => {
        const withoutLoading = prev.slice(0, -1)
        const botMessage: Message = {
          id: (Date.now() + 2).toString(),
          content: data.reply || data.error || "Sorry, I couldn't process your request.",
          sender: "bot",
          timestamp: new Date()
        }
        return [...withoutLoading, botMessage]
      })
    } catch (error) {
      console.error('Chat error:', error)
      // Remove loading message and add error response
      setMessages(prev => {
        const withoutLoading = prev.slice(0, -1)
        const errorMessage: Message = {
          id: (Date.now() + 2).toString(),
          content: "Sorry, I'm having trouble connecting. Please try again later.",
          sender: "bot",
          timestamp: new Date()
        }
        return [...withoutLoading, errorMessage]
      })
    }
  }

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-background pt-20 p-4">
        <div className="max-w-4xl mx-auto">
        <Card className="h-[80vh]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bot className="h-6 w-6" />
              HydroBot - Hydrogen Energy Assistant
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col h-full">
            <ScrollArea className="flex-1 mb-4">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex items-start gap-3 ${
                      message.sender === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    {message.sender === "bot" && (
                      <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                        <Bot className="h-4 w-4 text-primary-foreground" />
                      </div>
                    )}
                    <div
                      className={`max-w-[70%] p-3 rounded-lg ${
                        message.sender === "user"
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted"
                      }`}
                    >
                      <p>{message.content}</p>
                      <p className="text-xs opacity-70 mt-1">
                        {isClient ? message.timestamp.toLocaleTimeString() : ''}
                      </p>
                    </div>
                    {message.sender === "user" && (
                      <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
                        <User className="h-4 w-4 text-secondary-foreground" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </ScrollArea>
            <div className="flex gap-2">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ask about hydrogen energy..."
                onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                className="flex-1"
              />
              <Button onClick={handleSendMessage} size="icon">
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
        </div>
      </div>
    </>
  )
}
