'use client'

import { Button } from '@/components/ui/button'
import { useFlash } from '@/context/FlashContext'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function SignUpForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: ''
  })

  const { setFlash } = useFlash()

  const router = useRouter()

  const [errors, setErrors] = useState<Partial<Record<string, string[]>>>({})

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    setErrors(prev => ({ ...prev, [name]: [] })) // Clear error for that field
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({}) // Clear previous errors

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_KEY}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await res.json()

      if (!res.ok) {
        if (res.status === 422 && data.errors) {
          // Laravel validation errors
          setErrors(data.errors)
        } else {
          console.error('Registration failed:', data)
        }
        return
      }

      // Success
      setFlash({
        type: 'success',
        title: 'Sign Up Successful!',
        description: 'You have been Sign Up successfully. Please Login',
      })
      router.push('/sign-in')
    } catch (err) {
      console.error('Unexpected error:', err)
    }
  }


  const renderError = (field: string) => {
    return errors[field]?.length ? (
      <p className="text-sm text-red-500 mt-1">{errors[field]?.[0]}</p>
    ) : null
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <form onSubmit={handleSubmit} className="w-full max-w-md space-y-4 p-8 rounded-xl">
        <h2 className="text-2xl font-semibold text-center">Sign Up</h2>

        <div>
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={formData.name}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            required
          />
          {renderError('name')}
        </div>

        <div>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            required
          />
          {renderError('email')}
        </div>

        <div>
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            required
          />
          {renderError('password')}
        </div>

        <div>
          <input
            type="password"
            name="password_confirmation"
            placeholder="Confirm Password"
            value={formData.password_confirmation}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            required
          />
          {renderError('password_confirmation')}
        </div>

        <Button type="submit" variant="primary" className="w-full">
          Sign Up
        </Button>
      </form>
    </div>
  )
}
