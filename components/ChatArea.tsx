'use client'

import { Message } from '@/types'
import { Bot, User } from 'lucide-react'
import { RefObject } from 'react'

interface ChatAreaProps {
  messages: Message[]
  isLoading: boolean
  messagesEndRef: RefObject<HTMLDivElement>
}

export default function ChatArea({ messages, isLoading, messagesEndRef }: ChatAreaProps) {
  const formatContent = (content: string) => {
    return content
      .replace(/\n/g, '<br>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
  }

  return (
    <div className="flex-1 overflow-y-auto">
      {messages.map((message, index) => (
        <div
          key={message.id}
          className={`py-6 px-4 md:px-8 animate-fadeIn ${
            message.role === 'user' ? 'bg-timana-user' : 'bg-timana-bg'
          }`}
          style={{ animationDelay: `${index * 0.1}s` }}
        >
          <div className="max-w-3xl mx-auto flex gap-4">
            {/* Avatar */}
            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
              message.role === 'user' 
                ? 'bg-timana-accent' 
                : 'bg-green-600'
            }`}>
              {message.role === 'user' ? (
                <User size={16} className="text-white" />
              ) : (
                <Bot size={16} className="text-white" />
              )}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <span className="font-medium text-white">
                  {message.role === 'user' ? 'Aap' : 'Timana AI'}
                </span>
                <span className="text-xs text-gray-500">
                  {new Date(message.timestamp).toLocaleTimeString('hi-IN', { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </span>
              </div>
              
              <div 
                className="text-timana-text leading-relaxed"
                dangerouslySetInnerHTML={{ __html: formatContent(message.content) }}
              />
            </div>
          </div>
        </div>
      ))}

      {/* Loading Indicator */}
      {isLoading && (
        <div className="py-6 px-4 md:px-8 bg-timana-bg animate-fadeIn">
          <div className="max-w-3xl mx-auto flex gap-4">
            <div className="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center">
              <Bot size={16} className="text-white" />
            </div>
            <div className="flex items-center gap-2">
              <div className="typing-dot"></div>
              <div className="typing-dot"></div>
              <div className="typing-dot"></div>
              <span className="text-sm text-gray-500 ml-2">Soch raha hoon...</span>
            </div>
          </div>
        </div>
      )}

      <div ref={messagesEndRef} />
    </div>
  )
}