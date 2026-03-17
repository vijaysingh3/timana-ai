import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatTimestamp(timestamp: number): string {
  return new Date(timestamp).toLocaleString('hi-IN', {
    hour: '2-digit',
    minute: '2-digit',
    day: 'numeric',
    month: 'short'
  })
}