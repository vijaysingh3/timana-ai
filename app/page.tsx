'use client'

import { useState, useRef, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import Sidebar from '@/components/Sidebar'
import ChatArea from '@/components/ChatArea'
import InputBox from '@/components/InputBox'
import Welcome from '@/components/Welcome'
import { Message, Conversation } from '@/types'

// ============ AUTH SCREEN ============
function AuthScreen() {
  const [loading, setLoading] = useState(false)

  const handleGoogleLogin = async () => {
    setLoading(true)
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin }
    })
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-timana-bg flex items-center justify-center px-4">
      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">🤖 Timana AI</h1>
          <p className="text-gray-400">Apna personal AI assistant</p>
        </div>

        {/* Card */}
        <div className="bg-timana-sidebar border border-timana-border rounded-xl p-8">
          <h2 className="text-xl font-semibold text-white mb-2 text-center">
            Swagat Hai! 🙏
          </h2>
          <p className="text-gray-400 text-sm text-center mb-8">
            Apne Google account se login karo
          </p>

          {/* Google Login Button */}
          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 py-3 bg-white text-gray-800 rounded-lg font-medium hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {loading ? (
              <span className="text-gray-600">⏳ Redirect ho raha hai...</span>
            ) : (
              <>
                <svg width="20" height="20" viewBox="0 0 48 48">
                  <path fill="#FFC107" d="M43.6 20H24v8h11.3C33.6 33.1 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.8 1.1 7.9 3l5.7-5.7C34.1 6.5 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20c11 0 19.7-8 19.7-20 0-1.3-.1-2.7-.1-4z"/>
                  <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.6 15.1 18.9 12 24 12c3 0 5.8 1.1 7.9 3l5.7-5.7C34.1 6.5 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/>
                  <path fill="#4CAF50" d="M24 44c5.2 0 9.9-1.9 13.5-5.1l-6.2-5.2C29.4 35.5 26.8 36 24 36c-5.2 0-9.6-3-11.3-7.3l-6.5 5C9.6 39.6 16.3 44 24 44z"/>
                  <path fill="#1976D2" d="M43.6 20H24v8h11.3c-.9 2.4-2.5 4.4-4.6 5.8l6.2 5.2C40.8 35.4 44 30.1 44 24c0-1.3-.1-2.7-.4-4z"/>
                </svg>
                <span>Google se Login Karo</span>
              </>
            )}
          </button>

          <p className="text-center text-gray-500 text-xs mt-6">
            Login karke aap hamare terms se agree karte ho
          </p>
        </div>
      </div>
    </div>
  )
}

// ============ MAIN PAGE ============
export default function Home() {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [authChecked, setAuthChecked] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      setAuthChecked(true)
      if (user) loadConversations()
    }
    getUser()

    supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user || null)
      if (session?.user) loadConversations()
      else {
        setConversations([])
        setMessages([])
        setCurrentConversationId(null)
      }
    })
  }, [])

  // Auto scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

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

  const createNewChat = async () => {
    if (!user) return

    const { data } = await supabase
      .from('conversations')
      .insert([{ user_id: user.id, title: 'Naya Chat' }])
      .select()
      .single()

    if (data) {
      setCurrentConversationId(data.id)
      setMessages([])
      loadConversations()
    }
  }

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

  const sendMessage = async (content: string) => {
    if (!content.trim() || !user || !currentConversationId) return

    setIsLoading(true)

    // User message save + show
    await supabase.from('messages').insert([{
      user_id: user.id,
      conversation_id: currentConversationId,
      role: 'user',
      content
    }])

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: Date.now()
    }
    setMessages(prev => [...prev, userMsg])

    // First message = conversation title update
    if (messages.length === 0) {
      const title = content.length > 30 ? content.substring(0, 30) + '...' : content
      await supabase
        .from('conversations')
        .update({ title, updated_at: new Date().toISOString() })
        .eq('id', currentConversationId)
      loadConversations()
    }

    // AI call ✅
    try {
      const { data } = await supabase.functions.invoke('glm-ai-test', {
        body: {
          messages: [
            { role: 'system', content: 'You are Timana AI. Always respond in Hindi.' },
            { role: 'user', content }
          ],
          max_tokens: 1000,   // ✅ Add kiya
          temperature: 0.7    // ✅ Add kiya
        }
      })

      if (data?.success) {
        // Content blank ho toh reasoning use karo ✅
        const aiContent = data.content && data.content.trim() !== ''
          ? data.content
          : data.reasoning || 'Kuch samajh nahi aaya, dobara pucho!'

        await supabase.from('messages').insert([{
          user_id: user.id,
          conversation_id: currentConversationId,
          role: 'assistant',
          content: aiContent   // ✅ aiContent use kiya
        }])

        const aiMsg: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: aiContent,  // ✅ aiContent use kiya
          timestamp: Date.now()
        }
        setMessages(prev => [...prev, aiMsg])

        // Update conversation timestamp
        await supabase
          .from('conversations')
          .update({ updated_at: new Date().toISOString() })
          .eq('id', currentConversationId)
        loadConversations()
      }
    } catch {
      const errMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Maafi karo! AI se connect nahi ho paya. Thodi der baad try karo.',
        timestamp: Date.now()
      }
      setMessages(prev => [...prev, errMsg])
    } finally {
      setIsLoading(false)
    }
  }

  const signOut = async () => {
    await supabase.auth.signOut()
  }

  // Auth check loading
  if (!authChecked) {
    return (
      <div className="min-h-screen bg-timana-bg flex items-center justify-center">
        <div className="text-gray-400">Loading...</div>
      </div>
    )
  }

  // Not logged in
  if (!user) return <AuthScreen />

  // Logged in
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
          <Welcome onQuickAsk={(q) => {
            if (!currentConversationId) {
              createNewChat().then(() => sendMessage(q))
            } else {
              sendMessage(q)
            }
          }} />
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