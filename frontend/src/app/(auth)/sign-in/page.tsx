'use client'

import { Button } from '@/components/ui/button'
import { AppContext } from '@/context/AppContext'
import { useRouter } from 'next/navigation'
import { useContext, useState } from 'react'
import { useFlash } from '@/context/FlashContext'


export default function LoginForm() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })

  const router = useRouter()
  const [errors, setErrors] = useState<Partial<Record<string, string[]>>>({})
  const { setToken } = useContext(AppContext)
  const { setFlash } = useFlash()


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    setErrors(prev => ({ ...prev, [name]: [] }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({})

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_KEY}/login`, {
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
          setErrors(data.errors)
        } else if (res.status === 401) {
          setErrors({ email: ['Invalid credentials'] })
        } else {
          console.error('Unknown login error:', data)
        }
        return
      }

      // ✅ Set token in cookie

      // ✅ Also store in context if needed
      document.cookie = `token=${data.token}; path=/;`
      setToken(data.token)

      setFlash({
        type: 'success',
        title: 'Login Successful!',
        description: 'You have been logged in successfully.',
      })

      router.push('/dashboard')


    } catch (err) {
      console.error('Login failed:', err)
    }
  }

  const renderError = (field: string) => {
    return errors[field]?.length ? (
      <p className="text-sm text-red-500 mt-1">{errors[field][0]}</p>
    ) : null
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <form onSubmit={handleSubmit} className="w-full max-w-md space-y-4 p-8 rounded-xl border">
        <h2 className="text-2xl font-semibold text-center">Login</h2>

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

        <Button type="submit" variant="primary" className="w-full">
          Login
        </Button>
      </form>
    </div>
  )
}
