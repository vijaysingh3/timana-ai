export interface Message {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp: number
}

export interface Conversation {
  id: string
  title: string
  timestamp: number
}

export interface User {
  id: string
  email: string
  name: string
  avatar?: string
}