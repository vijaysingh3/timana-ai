'use client'

import { Message } from '@/types'
import { Bot, User } from 'lucide-react'
import { RefObject } from 'react'

interface ChatAreaProps {
  messages: Message[]
  isLoading: boolean
  messagesEndRef: RefObject<HTMLDivElement>
}

function renderMarkdown(content: string): string {
  return content
    .replace(/```[\w]*\n[\s\S]*?```/gm, (match) => {
      const code = match.replace(/```[\w]*\n/, '').replace(/```$/, '')
      return `<pre class="bg-gray-800 rounded-lg p-3 my-2 overflow-x-auto text-xs text-green-400 font-mono"><code>${code}</code></pre>`
    })
    .replace(/`([^`]+)`/g, '<code class="bg-gray-700 px-1 py-0.5 rounded text-green-400 text-xs font-mono">$1</code>')
    .replace(/\*\*(.*?)\*\*/g, '<strong class="text-white font-semibold">$1</strong>')
    .replace(/\*(.*?)\*/g, '<em class="text-gray-300 italic">$1</em>')
    .replace(/^### (.*?)$/gm, '<h3 class="text-white font-semibold text-sm mt-3 mb-1">$1</h3>')
    .replace(/^## (.*?)$/gm, '<h2 class="text-white font-semibold text-base mt-3 mb-1">$1</h2>')
    .replace(/^# (.*?)$/gm, '<h1 class="text-white font-bold text-lg mt-3 mb-1">$1</h1>')
    .replace(/^\s*[-*•] (.*?)$/gm, '<li class="ml-4 text-timana-text" style="list-style-type:disc">$1</li>')
    .replace(/^\d+\. (.*?)$/gm, '<li class="ml-4 text-timana-text" style="list-style-type:decimal">$1</li>')
    .replace(/\n\n/g, '<br><br>')
    .replace(/\n/g, '<br>')
}

export default function ChatArea({ messages, isLoading, messagesEndRef }: ChatAreaProps) {
  return (
    <div className="flex-1 overflow-y-auto overflow-x-hidden">
      {messages.map((message) => (
        <div
          key={message.id}
          className={`py-4 px-3 md:px-6 animate-fadeIn ${
            message.role === 'user' ? 'bg-timana-user' : 'bg-timana-bg'
          }`}
        >
          <div className="max-w-3xl mx-auto flex gap-2 md:gap-3">
            {/* Avatar */}
            <div className={`w-7 h-7 md:w-8 md:h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
              message.role === 'user' ? 'bg-timana-accent' : 'bg-green-600'
            }`}>
              {message.role === 'user' ? (
                <User size={14} className="text-white" />
              ) : (
                <Bot size={14} className="text-white" />
              )}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-medium text-white text-xs md:text-sm">
                  {message.role === 'user' ? 'Aap' : 'Timana AI'}
                </span>
                <span className="text-xs text-gray-500">
                  {new Date(message.timestamp).toLocaleTimeString('hi-IN', {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
              </div>

              {message.role === 'assistant' ? (
                <div
                  className="text-timana-text leading-relaxed prose-custom text-sm md:text-base break-words"
                  dangerouslySetInnerHTML={{ __html: renderMarkdown(message.content) }}
                />
              ) : (
                <div className="text-timana-text leading-relaxed whitespace-pre-wrap text-sm md:text-base break-words">
                  {message.content}
                </div>
              )}
            </div>
          </div>
        </div>
      ))}

      {/* Typing */}
      {isLoading && (
        <div className="py-4 px-3 md:px-6 bg-timana-bg animate-fadeIn">
          <div className="max-w-3xl mx-auto flex gap-2 md:gap-3">
            <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-green-600 flex items-center justify-center flex-shrink-0 mt-0.5">
              <Bot size={14} className="text-white" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-medium text-white text-xs md:text-sm">Timana AI</span>
              </div>
              <div className="flex items-center gap-1.5 mt-2">
                <div className="typing-dot"></div>
                <div className="typing-dot"></div>
                <div className="typing-dot"></div>
                <span className="text-xs text-gray-500 ml-1">Soch raha hoon...</span>
              </div>
            </div>
          </div>
        </div>
      )}

      <div ref={messagesEndRef} className="h-2" />
    </div>
  )
}