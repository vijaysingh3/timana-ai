'use client'

import { Plus, MessageSquare, Settings, LogOut, User } from 'lucide-react'
import { Conversation } from '@/types'

interface SidebarProps {
  conversations: Conversation[]
  currentId: string | null
  onNewChat: () => void
  onSelect: (id: string) => void
  user?: any
  onSignOut?: () => void
}

export default function Sidebar({ 
  conversations, 
  currentId, 
  onNewChat, 
  onSelect,
  user,
  onSignOut
}: SidebarProps) {
  return (
    <div className="w-64 bg-timana-sidebar h-full flex flex-col border-r border-timana-border">
      {/* New Chat Button */}
      <div className="p-4">
        <button 
          onClick={onNewChat}
          className="w-full flex items-center gap-3 px-4 py-3 border border-timana-border rounded-lg text-timana-text hover:bg-timana-input transition-colors"
        >
          <Plus size={16} />
          <span className="text-sm">Naya Chat</span>
        </button>
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto px-2">
        <div className="text-xs text-gray-500 px-3 py-2 uppercase tracking-wider">
          Aaj ke Chats
        </div>
        
        {conversations.map((conv) => (
          <button
            key={conv.id}
            onClick={() => onSelect(conv.id)}
            className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg text-left transition-colors mb-1 ${
              currentId === conv.id 
                ? 'bg-timana-input text-white' 
                : 'text-gray-300 hover:bg-timana-input/50'
            }`}
          >
            <MessageSquare size={16} className="flex-shrink-0" />
            <span className="text-sm truncate">{conv.title}</span>
          </button>
        ))}
      </div>

      {/* User Profile + Logout */}
      <div className="p-4 border-t border-timana-border">
        <div className="flex items-center gap-3 px-3 py-2 text-gray-300 hover:bg-timana-input rounded-lg cursor-pointer transition-colors mb-2">
          <Settings size={16} />
          <span className="text-sm">Settings</span>
        </div>
        
        <div className="flex items-center gap-3 px-3 py-3 bg-timana-input rounded-lg">
          <div className="w-8 h-8 bg-timana-accent rounded-full flex items-center justify-center">
            <User size={16} className="text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm text-white truncate">
              {user?.user_metadata?.full_name || 'User'}
            </p>
            <p className="text-xs text-gray-500 truncate">
              {user?.email || ''}
            </p>
          </div>
          <LogOut 
            size={16} 
            className="text-gray-400 cursor-pointer hover:text-white" 
            onClick={onSignOut}
          />
        </div>
      </div>
    </div>
  )
}