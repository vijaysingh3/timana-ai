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
      <div className="p-3 flex-shrink-0">
        <button
          onClick={onNewChat}
          className="w-full flex items-center gap-3 px-4 py-3 border border-timana-border rounded-lg text-timana-text hover:bg-timana-input transition-colors active:scale-95 text-sm"
        >
          <Plus size={16} />
          <span>Naya Chat</span>
        </button>
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto px-2 min-h-0">
        {conversations.length > 0 && (
          <div className="text-xs text-gray-500 px-3 py-2 uppercase tracking-wider">
            Chats
          </div>
        )}
        {conversations.map((conv) => (
          <button
            key={conv.id}
            onClick={() => onSelect(conv.id)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors mb-1 active:scale-95 ${
              currentId === conv.id
                ? 'bg-timana-input text-white'
                : 'text-gray-300 hover:bg-timana-input/50'
            }`}
          >
            <MessageSquare size={15} className="flex-shrink-0" />
            <span className="text-sm truncate">{conv.title}</span>
          </button>
        ))}
      </div>

      {/* User Profile */}
      <div className="p-3 border-t border-timana-border flex-shrink-0">
        <div className="flex items-center gap-2 px-3 py-2 text-gray-300 hover:bg-timana-input rounded-lg cursor-pointer transition-colors mb-2">
          <Settings size={15} />
          <span className="text-sm">Settings</span>
        </div>
        <div className="flex items-center gap-2 px-3 py-2.5 bg-timana-input rounded-lg">
          <div className="w-7 h-7 bg-timana-accent rounded-full flex items-center justify-center flex-shrink-0">
            <User size={14} className="text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs text-white truncate font-medium">
              {user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User'}
            </p>
            <p className="text-xs text-gray-500 truncate">
              {user?.email || ''}
            </p>
          </div>
          <LogOut
            size={14}
            className="text-gray-400 cursor-pointer hover:text-white flex-shrink-0"
            onClick={onSignOut}
          />
        </div>
      </div>
    </div>
  )
}