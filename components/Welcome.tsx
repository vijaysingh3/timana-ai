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
    <div className="flex-1 flex flex-col items-center justify-center px-4">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-white mb-4">Timana AI</h1>
        <p className="text-xl text-gray-400">Namaste Vijay ji! Aaj kya help chahiye?</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl w-full">
        {quickActions.map((action, index) => (
          <button
            key={index}
            onClick={() => onQuickAsk(action.query)}
            className="flex items-start gap-4 p-4 bg-timana-input rounded-lg border border-timana-border hover:border-gray-500 transition-all text-left group"
          >
            <div className="p-2 bg-timana-bg rounded-lg group-hover:bg-timana-accent/20">
              <action.icon size={20} className="text-timana-accent" />
            </div>
            <div>
              <h3 className="text-white font-medium mb-1">{action.title}</h3>
              <p className="text-sm text-gray-400">{action.description}</p>
            </div>
          </button>
        ))}
      </div>

      <div className="mt-12 text-sm text-gray-500">
        💡 Tip: Direct question pucho, main Hindi aur English dono mein samajhta hoon!
      </div>
    </div>
  )
}