import React, { useState, useRef, useEffect } from 'react'
import { MessageSquare, X, Send, Loader2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'Hallo! Ich bin der XYRA AI Assistent. Wie kann ich dir helfen?'
    }
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef(null)

  // N8N Webhook URL
  const WEBHOOK_URL = 'https://n8n.xyra.digital/webhook/chatbot'

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Input validation and sanitization
  const validateAndSanitizeInput = (text) => {
    // Max length check
    if (text.length > 1000) {
      return { valid: false, error: 'Nachricht zu lang (max 1000 Zeichen)' }
    }

    // Remove potential injection patterns (basic sanitization)
    const sanitized = text
      .replace(/\n{3,}/g, '\n\n') // Limit consecutive newlines
      .trim()

    // Block common prompt injection attempts
    const dangerousPatterns = [
      /ignore\s+(all\s+)?(previous|above|prior)\s+instructions/i,
      /you\s+are\s+now/i,
      /system\s*:/i,
      /\[SYSTEM\]/i,
      /new\s+instructions/i,
      /forget\s+(everything|all|previous)/i,
      /disregard/i
    ]

    for (const pattern of dangerousPatterns) {
      if (pattern.test(sanitized)) {
        return { valid: false, error: 'Ungültige Eingabe erkannt' }
      }
    }

    return { valid: true, sanitized }
  }

  const sendMessage = async (e) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage = input.trim()

    // Validate and sanitize input
    const validation = validateAndSanitizeInput(userMessage)
    if (!validation.valid) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: validation.error
      }])
      setInput('')
      return
    }

    setInput('')

    // Add user message
    setMessages(prev => [...prev, { role: 'user', content: validation.sanitized }])
    setIsLoading(true)

    try {
      // Send to n8n webhook
      const response = await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: validation.sanitized,
          conversationHistory: messages.slice(-10), // Last 10 messages for context
          timestamp: new Date().toISOString(),
          sessionId: sessionStorage.getItem('chatSessionId') || (() => {
            const id = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
            sessionStorage.setItem('chatSessionId', id)
            return id
          })()
        })
      })

      if (!response.ok) {
        throw new Error('Network response was not ok')
      }

      const data = await response.json()

      // Add assistant response
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: data.response || data.message || 'Entschuldigung, ich konnte keine Antwort generieren.'
      }])
    } catch (error) {
      console.error('Error sending message:', error)
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Entschuldigung, es gab einen Fehler. Bitte versuche es später erneut oder kontaktiere uns direkt.'
      }])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      {/* Chat Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-110"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <X className="text-black" size={24} />
            </motion.div>
          ) : (
            <motion.div
              key="open"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <MessageSquare className="text-black" size={24} />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-24 right-6 z-50 w-96 h-[600px] bg-dark-light border border-white/10 rounded-2xl shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-primary/20 to-accent/20 border-b border-white/10 p-4 flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center">
                <MessageSquare className="text-black" size={20} />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-white">XYRA AI Assistent</h3>
                <p className="text-xs text-gray-400">Powered by ChatGPT</p>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-white transition-colors"
                title="Chat schließen"
              >
                <X size={20} />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                      message.role === 'user'
                        ? 'bg-gradient-to-br from-primary to-accent text-black'
                        : 'bg-dark border border-white/10 text-white'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  </div>
                </motion.div>
              ))}

              {isLoading && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-start"
                >
                  <div className="bg-dark border border-white/10 text-white rounded-2xl px-4 py-2 flex items-center gap-2">
                    <Loader2 className="animate-spin text-primary" size={16} />
                    <p className="text-sm">Schreibt...</p>
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form onSubmit={sendMessage} className="p-4 border-t border-white/10">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Schreibe eine Nachricht..."
                  className="flex-1 px-4 py-3 bg-dark border border-white/10 rounded-xl focus:border-primary focus:outline-none transition-colors duration-300 text-white placeholder-gray-500"
                  disabled={isLoading}
                />
                <button
                  type="submit"
                  disabled={isLoading || !input.trim()}
                  className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center hover:opacity-90 transition-opacity duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="text-black" size={20} />
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default ChatBot
