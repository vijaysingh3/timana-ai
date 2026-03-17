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
    target.style.height = Math.min(target.scrollHeight, 150) + 'px'
  }

  return (
    <div className="border-t border-timana-border bg-timana-bg p-3 md:p-4">
      <div className="max-w-3xl mx-auto">
        <div className="relative bg-timana-input rounded-xl border border-timana-border focus-within:border-gray-500 transition-colors">
          <textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            onInput={handleInput}
            placeholder={disabled ? "Pehle naya chat shuru karo..." : "Message Timana AI..."}
            disabled={disabled || isLoading}
            rows={1}
            className="w-full bg-transparent text-timana-text placeholder-gray-500 px-4 py-3 pr-12 resize-none outline-none min-h-[48px] max-h-[150px] disabled:opacity-50 text-sm md:text-base"
          />
          <button
            onClick={handleSubmit}
            disabled={!message.trim() || isLoading || disabled}
            className="absolute right-2 bottom-2 p-2 bg-timana-accent text-white rounded-lg hover:bg-opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95"
          >
            <Send size={16} />
          </button>
        </div>
        <p className="text-xs text-center text-gray-500 mt-2 hidden md:block">
          Timana AI — Powered by GLM-4.5 Flash
        </p>
      </div>
    </div>
  )
}