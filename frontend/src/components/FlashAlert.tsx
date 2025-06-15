// components/FlashMessage.tsx
'use client'

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { CheckCircle2Icon, AlertCircleIcon } from 'lucide-react'
import { useFlash } from '@/context/FlashContext'
import { useEffect } from 'react'

export default function FlashAlert() {
  const { flash, setFlash } = useFlash()

  useEffect(() => {
    if (flash) {
      const timer = setTimeout(() => setFlash(null), 3000)
      return () => clearTimeout(timer)
    }
  }, [flash, setFlash])

  if (!flash) return null

  const Icon = flash.type === 'success' ? CheckCircle2Icon : AlertCircleIcon

  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-md px-4">
      <Alert variant={flash.type === 'success' ? 'default' : 'destructive'}>
        <Icon className="h-5 w-5" />
        <AlertTitle>{flash.title}</AlertTitle>
        {flash.description && (
          <AlertDescription>{flash.description}</AlertDescription>
        )}
      </Alert>
    </div>
  )
}
