'use client'

import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function LoginPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === 'SIGNED_IN' && session) {
          router.push('/dashboard')
        }
      }
    )

    return () => subscription?.unsubscribe()
  }, [router])

  const handleGoogleLogin = async () => {
    try {
      setLoading(true)
      setError(null)

      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (error) throw error
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-neutral-950 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-8">
          <h1 className="text-3xl font-bold text-white mb-2 text-center">SideGuide</h1>
          <p className="text-neutral-400 text-center mb-8">
            Sign in to your account
          </p>

          {error && (
            <div className="mb-6 p-4 bg-red-900/20 border border-red-800 rounded text-red-400 text-sm">
              {error}
            </div>
          )}

          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full px-4 py-3 bg-white text-neutral-950 font-semibold rounded-lg hover:bg-neutral-100 transition disabled:opacity-50"
          >
            {loading ? 'Signing in...' : 'Sign in with Google'}
          </button>

          <p className="text-center text-neutral-400 text-sm mt-6">
            By signing in, you agree to our{' '}
            <Link href="/terms" className="text-gold-400 hover:text-gold-300">
              Terms of Service
            </Link>
          </p>
        </div>
      </div>
    </main>
  )
}
