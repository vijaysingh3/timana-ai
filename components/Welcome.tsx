'use client'

import { Lightbulb, Code, Utensils, Sparkles } from 'lucide-react'

interface WelcomeProps {
  onQuickAsk: (question: string) => void
}

const quickActions = [
  {
    icon: Lightbulb,
    title: 'Bharat ke Facts',
    description: '3 amazing facts batao',
    query: 'Bharat ke 3 amazing facts batao'
  },
  {
    icon: Code,
    title: 'Code Help',
    description: 'Python mein loop kaise kaam karta hai?',
    query: 'Python mein loop kaise kaam karta hai?'
  },
  {
    icon: Utensils,
    title: 'Recipe',
    description: 'Healthy breakfast recipe do',
    query: 'Mujhe ek healthy breakfast recipe do'
  },
  {
    icon: Sparkles,
    title: 'Creative Writing',
    description: 'Ek kahani likho',
    query: 'Ek chhoti si kahani likho'
  }
]

export default function Welcome({ onQuickAsk }: WelcomeProps) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center px-4 py-8 overflow-y-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">Timana AI</h1>
        <p className="text-base md:text-xl text-gray-400">Namaste! Aaj kya help chahiye? 🙏</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-2xl">
        {quickActions.map((action, index) => (
          <button
            key={index}
            onClick={() => onQuickAsk(action.query)}
            className="flex items-start gap-3 p-4 bg-timana-input rounded-lg border border-timana-border hover:border-gray-500 transition-all text-left group active:scale-95"
          >
            <div className="p-2 bg-timana-bg rounded-lg group-hover:bg-timana-accent/20 flex-shrink-0">
              <action.icon size={18} className="text-timana-accent" />
            </div>
            <div className="min-w-0">
              <h3 className="text-white font-medium mb-1 text-sm md:text-base">{action.title}</h3>
              <p className="text-xs md:text-sm text-gray-400 truncate">{action.description}</p>
            </div>
          </button>
        ))}
      </div>

      <div className="mt-8 text-xs md:text-sm text-gray-500 text-center px-4">
        💡 Hindi ya English — dono mein baat karo!
      </div>
    </div>
  )
}