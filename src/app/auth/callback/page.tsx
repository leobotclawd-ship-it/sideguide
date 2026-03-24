'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function CallbackPage() {
  const router = useRouter()

  useEffect(() => {
    const handleCallback = async () => {
      const { data: { session }, error } = await supabase.auth.getSession()

      if (error) {
        console.error('Auth error:', error)
        router.push('/auth/login')
        return
      }

      if (session) {
        router.push('/dashboard')
      } else {
        router.push('/auth/login')
      }
    }

    handleCallback()
  }, [router])

  return (
    <main className="min-h-screen bg-neutral-950 flex items-center justify-center">
      <p className="text-neutral-400">Authenticating...</p>
    </main>
  )
}
