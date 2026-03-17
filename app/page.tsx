'use client'

import { useState, useRef, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import Sidebar from '@/components/Sidebar'
import ChatArea from '@/components/ChatArea'
import InputBox from '@/components/InputBox'
import Welcome from '@/components/Welcome'
import { Message, Conversation } from '@/types'

export default function Home() {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [user, setUser] = useState<any>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Check login status
  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      if (user) loadConversations()
    }
    getUser()

    // Auto-update when login/logout
    supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user || null)
      if (session?.user) loadConversations()
    })
  }, [])

  // Load chat list
  const loadConversations = async () => {
    const { data } = await supabase
      .from('conversations')
      .select('*')
      .order('updated_at', { ascending: false })

    if (data) {
      setConversations(data.map(conv => ({
        id: conv.id,
        title: conv.title,
        timestamp: new Date(conv.updated_at).getTime()
      })))
    }
  }

  // New chat button
  const createNewChat = async () => {
    if (!user) {
      alert('Pehle login karo!')
      return
    }

    const { data } = await supabase
      .from('conversations')
      .insert([{ user_id: user.id, title: 'New Chat' }])
      .select()
      .single()

    if (data) {
      setCurrentConversationId(data.id)
      setMessages([])
      loadConversations()
    }
  }

  // Open chat
  const selectConversation = async (id: string) => {
    setCurrentConversationId(id)
    
    const { data } = await supabase
      .from('messages')
      .select('*')
      .eq('conversation_id', id)
      .order('created_at', { ascending: true })

    if (data) {
      setMessages(data.map(msg => ({
        id: msg.id,
        role: msg.role,
        content: msg.content,
        timestamp: new Date(msg.created_at).getTime()
      })))
    }
  }

  // Send message to AI
  const sendMessage = async (content: string) => {
    if (!content.trim() || !user || !currentConversationId) return

    setIsLoading(true)

    // Save user message
    await supabase.from('messages').insert([{
      user_id: user.id,
      conversation_id: currentConversationId,
      role: 'user',
      content: content
    }])

    // Show user message
    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: Date.now()
    }
    setMessages(prev => [...prev, userMsg])

    // Call AI
    try {
      const { data } = await supabase.functions.invoke('glm-ai-test', {
        body: {
          messages: [
            { role: 'system', content: 'You are Timana AI. Always respond in Hindi.' },
            { role: 'user', content: content }
          ]
        }
      })

      if (data?.success) {
        // Save AI response
        await supabase.from('messages').insert([{
          user_id: user.id,
          conversation_id: currentConversationId,
          role: 'assistant',
          content: data.content
        }])

        // Show AI response
        const aiMsg: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: data.content,
          timestamp: Date.now()
        }
        setMessages(prev => [...prev, aiMsg])
      }
    } catch (error) {
      alert('AI error! Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  // Google Login
  const signIn = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin }
    })
  }

  // Logout
  const signOut = async () => {
    await supabase.auth.signOut()
    setUser(null)
    setConversations([])
    setMessages([])
    setCurrentConversationId(null)
  }

  // Not logged in - Show login screen
  if (!user) {
    return (
      <div className="min-h-screen bg-timana-bg flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-4">🤖 Timana AI</h1>
          <p className="text-gray-400 mb-8">Apna personal AI assistant</p>
          <button 
            onClick={signIn}
            className="px-8 py-3 bg-timana-accent text-white rounded-lg hover:bg-opacity-90"
          >
            Google se Login
          </button>
        </div>
      </div>
    )
  }

  // Logged in - Show chat
  return (
    <div className="flex h-screen bg-timana-bg">
      <Sidebar 
        conversations={conversations}
        currentId={currentConversationId}
        onNewChat={createNewChat}
        onSelect={selectConversation}
        user={user}
        onSignOut={signOut}
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
          disabled={!currentConversationId}
        />
      </div>
    </div>
  )
}