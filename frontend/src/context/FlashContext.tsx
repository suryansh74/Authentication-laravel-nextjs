// context/FlashContext.tsx
'use client'

import { createContext, useState, useContext } from 'react'

type FlashType = 'success' | 'error'
type FlashMessage = {
  title: string
  description?: string
  type: FlashType
} | null

const FlashContext = createContext<{
  flash: FlashMessage
  setFlash: (msg: FlashMessage) => void
}>({ flash: null, setFlash: () => {} })

export const FlashProvider = ({ children }: { children: React.ReactNode }) => {
  const [flash, setFlash] = useState<FlashMessage>(null)

  return (
    <FlashContext.Provider value={{ flash, setFlash }}>
      {children}
    </FlashContext.Provider>
  )
}

export const useFlash = () => useContext(FlashContext)
