'use client'

import { useState, useRef, useEffect } from 'react'
import Sidebar from '@/components/Sidebar'
import ChatArea from '@/components/ChatArea'
import InputBox from '@/components/InputBox'
import Welcome from '@/components/Welcome'
import { Message, Conversation } from '@/types'

export default function Home() {
  const [conversations, setConversations] = useState<Conversation[]>([
    { id: '1', title: 'Bharat ke Facts', timestamp: Date.now() },
    { id: '2', title: 'Python Coding Help', timestamp: Date.now() - 100000 },
    { id: '3', title: 'Recipe Ideas', timestamp: Date.now() - 200000 },
  ])
  
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const createNewChat = () => {
    const newId = Date.now().toString()
    const newConv: Conversation = {
      id: newId,
      title: 'New Chat',
      timestamp: Date.now()
    }
    setConversations([newConv, ...conversations])
    setCurrentConversationId(newId)
    setMessages([])
  }

  const selectConversation = (id: string) => {
    setCurrentConversationId(id)
    // Mock messages load
    if (id === '1') {
      setMessages([
        { id: '1', role: 'user', content: 'Bharat ke 3 amazing facts batao', timestamp: Date.now() - 10000 },
        { id: '2', role: 'assistant', content: 'Namaste! Yeh hain 3 amazing facts:\n\n1. 🇮🇳 Bharat mein world ka sabse bada postal network hai - 1,55,000+ post offices\n2. 🏏 Chail, Himachal mein world ka sabse uncha cricket ground hai - 2,444m height pe\n3. 🎲 Snakes & Ladders game ancient India mein invent hua tha', timestamp: Date.now() - 5000 }
      ])
    } else {
      setMessages([])
    }
  }

  const sendMessage = async (content: string) => {
    if (!content.trim()) return

    // Add user message
    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: Date.now()
    }
    
    setMessages(prev => [...prev, userMsg])
    setIsLoading(true)

    // Simulate AI response
    setTimeout(() => {
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `Namaste Vijay ji! Aapne pucha: "${content}"\n\nMain Timana AI hoon, aapki madad ke liye hamesha taiyaar! Abhi main demo mode mein hoon, jald hi poori tarah se kaam karunga.\n\nAapko kya help chahiye?`,
        timestamp: Date.now()
      }
      setMessages(prev => [...prev, aiMsg])
      setIsLoading(false)
      
      // Update conversation title if first message
      if (messages.length === 0 && currentConversationId) {
        setConversations(prev => prev.map(conv => 
          conv.id === currentConversationId 
            ? { ...conv, title: content.slice(0, 30) + '...' }
            : conv
        ))
      }
    }, 1500)
  }

  return (
    <div className="flex h-screen bg-timana-bg">
      <Sidebar 
        conversations={conversations}
        currentId={currentConversationId}
        onNewChat={createNewChat}
        onSelect={selectConversation}
      />
      
      <div className="flex-1 flex flex-col">
        {messages.length === 0 ? (
          <Welcome onQuickAsk={sendMessage} />
        ) : (
          <ChatArea 
            messages={messages} 
            isLoading={isLoading}
            messagesEndRef={messagesEndRef}
          />
        )}
        
        <InputBox 
          onSend={sendMessage} 
          isLoading={isLoading}
          disabled={!currentConversationId && messages.length === 0}
        />
      </div>
    </div>
  )
}