import { create } from 'zustand'

const ENTRANCE_KEY = 'sunset-portfolio:entered'

type AppState = {
  hasEntered: boolean
  markEntered: () => void
  cursorVariant: 'default' | 'hover'
  setCursorVariant: (v: 'default' | 'hover') => void
}

export const useAppStore = create<AppState>((set) => ({
  hasEntered:
    typeof window !== 'undefined' && window.sessionStorage.getItem(ENTRANCE_KEY) === '1',
  markEntered: () => {
    if (typeof window !== 'undefined') {
      window.sessionStorage.setItem(ENTRANCE_KEY, '1')
    }
    set({ hasEntered: true })
  },
  cursorVariant: 'default',
  setCursorVariant: (v) => set({ cursorVariant: v }),
}))
