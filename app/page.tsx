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
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleAuth = async () => {
    if (!email || !password) {
      setError('Email aur Password dono bharo!')
      return
    }
    if (!isLogin && !name) {
      setError('Apna naam bharo!')
      return
    }
    if (password.length < 6) {
      setError('Password kam se kam 6 characters ka hona chahiye!')
      return
    }

    setLoading(true)
    setError('')
    setSuccess('')

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) setError('Email ya Password galat hai!')
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { full_name: name } }
        })
        if (error) {
          setError(error.message)
        } else {
          setSuccess('Account ban gaya! Ab login karo.')
          setIsLogin(true)
        }
      }
    } catch {
      setError('Kuch galat hua, dobara try karo!')
    } finally {
      setLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleAuth()
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
          <h2 className="text-xl font-semibold text-white mb-6 text-center">
            {isLogin ? 'Login Karo' : 'Account Banao'}
          </h2>

          {/* Name field - only for register */}
          {!isLogin && (
            <div className="mb-4">
              <label className="block text-sm text-gray-400 mb-2">Aapka Naam</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Jaise: Vijay Singh"
                className="w-full bg-timana-input border border-timana-border rounded-lg px-4 py-3 text-white placeholder-gray-500 outline-none focus:border-gray-400 transition-colors"
              />
            </div>
          )}

          {/* Email */}
          <div className="mb-4">
            <label className="block text-sm text-gray-400 mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="aapka@email.com"
              className="w-full bg-timana-input border border-timana-border rounded-lg px-4 py-3 text-white placeholder-gray-500 outline-none focus:border-gray-400 transition-colors"
            />
          </div>

          {/* Password */}
          <div className="mb-6">
            <label className="block text-sm text-gray-400 mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Kam se kam 6 characters"
              className="w-full bg-timana-input border border-timana-border rounded-lg px-4 py-3 text-white placeholder-gray-500 outline-none focus:border-gray-400 transition-colors"
            />
          </div>

          {/* Error / Success Messages */}
          {error && (
            <div className="mb-4 p-3 bg-red-900/30 border border-red-700 rounded-lg text-red-400 text-sm">
              ❌ {error}
            </div>
          )}
          {success && (
            <div className="mb-4 p-3 bg-green-900/30 border border-green-700 rounded-lg text-green-400 text-sm">
              ✅ {success}
            </div>
          )}

          {/* Submit Button */}
          <button
            onClick={handleAuth}
            disabled={loading}
            className="w-full py-3 bg-timana-accent text-white rounded-lg font-medium hover:bg-opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {loading ? '⏳ Wait karo...' : isLogin ? '🚀 Login Karo' : '✨ Account Banao'}
          </button>

          {/* Toggle Login/Register */}
          <p className="text-center text-gray-400 text-sm mt-6">
            {isLogin ? 'Naya account chahiye?' : 'Pehle se account hai?'}
            <button
              onClick={() => { setIsLogin(!isLogin); setError(''); setSuccess('') }}
              className="text-timana-accent hover:underline ml-2"
            >
              {isLogin ? 'Register Karo' : 'Login Karo'}
            </button>
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

    // AI call
    try {
      const { data } = await supabase.functions.invoke('glm-ai-test', {
        body: {
          messages: [
            { role: 'system', content: 'You are Timana AI. Always respond in Hindi.' },
            { role: 'user', content }
          ]
        }
      })

      if (data?.success) {
        await supabase.from('messages').insert([{
          user_id: user.id,
          conversation_id: currentConversationId,
          role: 'assistant',
          content: data.content
        }])

        const aiMsg: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: data.content,
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