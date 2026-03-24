'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function Header() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user || null)
      setLoading(false)
    })

    return () => subscription?.unsubscribe()
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setUser(null)
  }

  return (
    <header className="bg-neutral-900 border-b border-neutral-800">
      <nav className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-gold-400">
          SideGuide
        </Link>

        <div className="flex gap-6 items-center">
          <Link href="/guides" className="text-neutral-300 hover:text-gold-400 transition">
            Guides
          </Link>

          {!loading && (
            <>
              {user ? (
                <>
                  <Link href="/dashboard" className="text-neutral-300 hover:text-gold-400 transition">
                    Dashboard
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="px-4 py-2 text-neutral-300 hover:text-gold-400 transition"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <Link
                  href="/auth/login"
                  className="px-4 py-2 bg-gold-600 hover:bg-gold-700 text-white rounded transition"
                >
                  Sign In
                </Link>
              )}
            </>
          )}
        </div>
      </nav>
    </header>
  )
}
