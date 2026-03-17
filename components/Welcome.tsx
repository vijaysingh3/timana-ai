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
    description: 'Python loop explain karo',
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
    title: 'Creative',
    description: 'Ek chhoti kahani likho',
    query: 'Ek chhoti si kahani likho'
  }
]

export default function Welcome({ onQuickAsk }: WelcomeProps) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center px-4 py-6 overflow-y-auto">
      <div className="text-center mb-6">
        <div className="text-4xl mb-3">🤖</div>
        <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">Timana AI</h1>
        <p className="text-sm md:text-base text-gray-400">Namaste! Aaj kya help chahiye? 🙏</p>
      </div>

      <div className="grid grid-cols-2 gap-2 w-full max-w-lg">
        {quickActions.map((action, index) => (
          <button
            key={index}
            onClick={() => onQuickAsk(action.query)}
            className="flex flex-col gap-2 p-3 md:p-4 bg-timana-input rounded-xl border border-timana-border hover:border-gray-500 transition-all text-left active:scale-95"
          >
            <div className="p-1.5 bg-timana-bg rounded-lg w-fit">
              <action.icon size={16} className="text-timana-accent" />
            </div>
            <div>
              <h3 className="text-white font-medium text-xs md:text-sm">{action.title}</h3>
              <p className="text-xs text-gray-400 mt-0.5 line-clamp-1">{action.description}</p>
            </div>
          </button>
        ))}
      </div>

      <p className="mt-6 text-xs text-gray-500 text-center">
        💡 Hindi ya English — dono mein baat karo!
      </p>
    </div>
  )
}