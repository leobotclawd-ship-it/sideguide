'use client'

import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [guides, setGuides] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    const { data: { session }, error } = await supabase.auth.getSession()

    if (error || !session) {
      router.push('/auth/login')
      return
    }

    setUser(session.user)
    await fetchGuides(session.user.id)
  }

  const fetchGuides = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('decklists')
        .select('*, sideguides(*)')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

      if (error) throw error
      setGuides(data || [])
    } catch (err) {
      console.error('Error fetching guides:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (guideId: string) => {
    if (!confirm('Are you sure you want to delete this guide?')) return

    try {
      const { error } = await supabase
        .from('decklists')
        .delete()
        .eq('id', guideId)

      if (error) throw error
      setGuides(guides.filter((g) => g.id !== guideId))
    } catch (err) {
      console.error('Error deleting guide:', err)
    }
  }

  const togglePublic = async (guideId: string, isPublic: boolean) => {
    try {
      const { error } = await supabase
        .from('decklists')
        .update({ is_public: !isPublic })
        .eq('id', guideId)

      if (error) throw error

      setGuides(
        guides.map((g) =>
          g.id === guideId ? { ...g, is_public: !isPublic } : g
        )
      )
    } catch (err) {
      console.error('Error updating guide:', err)
    }
  }

  if (loading) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-neutral-950 flex items-center justify-center">
          <p className="text-neutral-400">Loading...</p>
        </div>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-neutral-950">
        <div className="max-w-6xl mx-auto px-4 py-12">
          <div className="flex justify-between items-center mb-12">
            <h1 className="text-4xl font-bold text-white">My Guides</h1>
            <Link
              href="/create"
              className="px-6 py-3 bg-gold-600 hover:bg-gold-700 text-white font-semibold rounded-lg transition"
            >
              Create New
            </Link>
          </div>

          {guides.length === 0 ? (
            <div className="text-center py-12 text-neutral-400">
              <p className="mb-4">You haven't created any guides yet.</p>
              <Link
                href="/create"
                className="text-gold-400 hover:text-gold-300"
              >
                Create your first sideboard guide
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {guides.map((guide) => (
                <div
                  key={guide.id}
                  className="p-6 bg-neutral-900 border border-neutral-800 rounded-lg"
                >
                  <h3 className="text-xl font-bold text-white mb-2">
                    {guide.name}
                  </h3>
                  <p className="text-sm text-neutral-400 mb-4">
                    Format: <span className="capitalize">{guide.format}</span>
                  </p>
                  <p className="text-sm text-neutral-500 mb-6">
                    {guide.sideguides?.length || 0} matchup
                    {(guide.sideguides?.length || 0) !== 1 ? 's' : ''}
                  </p>

                  <div className="flex gap-2 flex-wrap">
                    <Link
                      href={`/guides/${guide.id}`}
                      className="flex-1 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded transition text-center"
                    >
                      View
                    </Link>
                    <button
                      onClick={() => togglePublic(guide.id, guide.is_public)}
                      className="flex-1 px-3 py-2 bg-neutral-700 hover:bg-neutral-600 text-white text-sm font-semibold rounded transition"
                    >
                      {guide.is_public ? 'Make Private' : 'Make Public'}
                    </button>
                    <button
                      onClick={() => handleDelete(guide.id)}
                      className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold rounded transition"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}
