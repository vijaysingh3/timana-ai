'use client'

import { Message } from '@/types'
import { Bot, User } from 'lucide-react'
import { RefObject } from 'react'

interface ChatAreaProps {
  messages: Message[]
  isLoading: boolean
  messagesEndRef: RefObject<HTMLDivElement>
}

// ✅ Markdown renderer
function renderMarkdown(content: string): string {
  return content
    .replace(/```(\w+)?\n([\s\S]*?)```/g, '<pre class="bg-gray-800 rounded-lg p-4 my-3 overflow-x-auto text-sm text-green-400 font-mono"><code>$2</code></pre>')
    .replace(/`([^`]+)`/g, '<code class="bg-gray-700 px-1.5 py-0.5 rounded text-green-400 text-sm font-mono">$1</code>')
    .replace(/\*\*(.*?)\*\*/g, '<strong class="text-white font-semibold">$1</strong>')
    .replace(/\*(.*?)\*/g, '<em class="text-gray-300 italic">$1</em>')
    .replace(/^### (.*?)$/gm, '<h3 class="text-white font-semibold text-base mt-4 mb-2">$1</h3>')
    .replace(/^## (.*?)$/gm, '<h2 class="text-white font-semibold text-lg mt-4 mb-2">$1</h2>')
    .replace(/^# (.*?)$/gm, '<h1 class="text-white font-bold text-xl mt-4 mb-2">$1</h1>')
    .replace(/^\s*[-*•] (.*?)$/gm, '<li class="ml-4 text-timana-text list-disc">$1</li>')
    .replace(/(<li.*<\/li>)/gs, '<ul class="my-2 space-y-1">$1</ul>')
    .replace(/^\d+\. (.*?)$/gm, '<li class="ml-4 text-timana-text list-decimal">$1</li>')
    .replace(/\n\n/g, '<br><br>')
    .replace(/\n/g, '<br>')
}

export default function ChatArea({ messages, isLoading, messagesEndRef }: ChatAreaProps) {
  return (
    <div className="flex-1 overflow-y-auto">
      {messages.map((message) => (
        <div
          key={message.id}
          className={`py-6 px-4 md:px-8 animate-fadeIn ${
            message.role === 'user' ? 'bg-timana-user' : 'bg-timana-bg'
          }`}
        >
          <div className="max-w-3xl mx-auto flex gap-3 md:gap-4">
            {/* Avatar */}
            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-1 ${
              message.role === 'user' ? 'bg-timana-accent' : 'bg-green-600'
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
                <span className="font-medium text-white text-sm">
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
                // ✅ AI message — Markdown render karo
                <div
                  className="text-timana-text leading-relaxed prose-custom"
                  dangerouslySetInnerHTML={{ __html: renderMarkdown(message.content) }}
                />
              ) : (
                // User message — plain text
                <div className="text-timana-text leading-relaxed whitespace-pre-wrap">
                  {message.content}
                </div>
              )}
            </div>
          </div>
        </div>
      ))}

      {/* ✅ Loading — Typing Animation */}
      {isLoading && (
        <div className="py-6 px-4 md:px-8 bg-timana-bg animate-fadeIn">
          <div className="max-w-3xl mx-auto flex gap-3 md:gap-4">
            <div className="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center flex-shrink-0 mt-1">
              <Bot size={16} className="text-white" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className="font-medium text-white text-sm">Timana AI</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="typing-dot"></div>
                <div className="typing-dot"></div>
                <div className="typing-dot"></div>
                <span className="text-sm text-gray-500 ml-2">Soch raha hoon...</span>
              </div>
            </div>
          </div>
        </div>
      )}

      <div ref={messagesEndRef} />
    </div>
  )
}