'use client'

import { useState, useRef } from 'react'
import { Send } from 'lucide-react'

interface InputBoxProps {
  onSend: (message: string) => void
  isLoading: boolean
  disabled?: boolean
}

export default function InputBox({ onSend, isLoading, disabled }: InputBoxProps) {
  const [message, setMessage] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const handleSubmit = () => {
    if (!message.trim() || isLoading) return
    onSend(message)
    setMessage('')
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  const handleInput = (e: React.FormEvent<HTMLTextAreaElement>) => {
    const target = e.currentTarget
    target.style.height = 'auto'
    target.style.height = Math.min(target.scrollHeight, 120) + 'px'
  }

  return (
    <div className="border-t border-timana-border bg-timana-bg px-3 py-2 md:px-4 md:py-3 flex-shrink-0">
      <div className="max-w-3xl mx-auto">
        <div className="relative bg-timana-input rounded-xl border border-timana-border focus-within:border-gray-400 transition-colors">
          <textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            onInput={handleInput}
            placeholder={disabled ? "Naya chat shuru karo..." : "Message Timana AI..."}
            disabled={disabled || isLoading}
            rows={1}
            className="w-full bg-transparent text-timana-text placeholder-gray-500 px-3 py-2.5 pr-11 resize-none outline-none min-h-[44px] max-h-[120px] disabled:opacity-50 text-sm"
          />
          <button
            onClick={handleSubmit}
            disabled={!message.trim() || isLoading || disabled}
            className="absolute right-2 bottom-1.5 p-2 bg-timana-accent text-white rounded-lg hover:bg-opacity-90 disabled:opacity-40 disabled:cursor-not-allowed transition-all active:scale-95"
          >
            <Send size={15} />
          </button>
        </div>
      </div>
    </div>
  )
}