'use client'

import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import MatchupForm from '@/components/MatchupForm'

interface PageProps {
  params: {
    id: string
  }
}

export default function SideguideBuilderPage({ params }: PageProps) {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [decklist, setDecklist] = useState<any>(null)
  const [sideguide, setSideguide] = useState<any>(null)
  const [matchups, setMatchups] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showNewMatchup, setShowNewMatchup] = useState(false)
  const [editingMatchup, setEditingMatchup] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    checkAuthAndFetchData()
  }, [params.id])

  const checkAuthAndFetchData = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        router.push('/auth/login')
        return
      }

      setUser(session.user)
      await fetchData()
    } catch (err) {
      console.error('Error:', err)
    }
  }

  const fetchData = async () => {
    try {
      // Fetch decklist
      const { data: decklistData, error: decklistError } = await supabase
        .from('decklists')
        .select('*')
        .eq('id', params.id)
        .single()

      if (decklistError) throw decklistError
      setDecklist(decklistData)

      // Fetch sideguide
      const { data: sideguideData, error: sideguideError } = await supabase
        .from('sideguides')
        .select('*')
        .eq('decklist_id', params.id)
        .single()

      if (sideguideError) throw sideguideError
      setSideguide(sideguideData)

      // Fetch matchups
      const { data: matchupData, error: matchupError } = await supabase
        .from('sideguide_matchups')
        .select('*')
        .eq('sideguide_id', sideguideData.id)
        .order('created_at', { ascending: true })

      if (matchupError) throw matchupError
      setMatchups(matchupData || [])
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteMatchup = async (matchupId: string) => {
    if (!confirm('Delete this matchup guide?')) return

    try {
      const { error } = await supabase
        .from('sideguide_matchups')
        .delete()
        .eq('id', matchupId)

      if (error) throw error
      setMatchups(matchups.filter((m) => m.id !== matchupId))
    } catch (err: any) {
      setError(err.message)
    }
  }

  const handleMatchupSaved = async () => {
    setShowNewMatchup(false)
    setEditingMatchup(null)
    await fetchData()
  }

  const handleFinish = async () => {
    if (!decklist) return

    try {
      const { error } = await supabase
        .from('decklists')
        .update({ updated_at: new Date().toISOString() })
        .eq('id', params.id)

      if (error) throw error
      router.push(`/guides/${params.id}`)
    } catch (err: any) {
      setError(err.message)
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

  if (!decklist || !sideguide) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-neutral-950 flex items-center justify-center">
          <p className="text-neutral-400">Decklist not found</p>
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
          <div className="mb-12">
            <h1 className="text-4xl font-bold text-white mb-4">{decklist.name}</h1>
            <p className="text-lg text-neutral-400">
              Building sideboard guides ({matchups.length}/20 matchups)
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-900/20 border border-red-800 rounded text-red-400">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Matchups List */}
            <div className="lg:col-span-2">
              <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-6 mb-8">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-white">Matchup Guides</h2>
                  {matchups.length < 20 && !showNewMatchup && !editingMatchup && (
                    <button
                      onClick={() => setShowNewMatchup(true)}
                      className="px-4 py-2 bg-gold-600 hover:bg-gold-700 text-white font-semibold rounded transition"
                    >
                      + New Matchup
                    </button>
                  )}
                </div>

                {showNewMatchup || editingMatchup ? (
                  <MatchupForm
                    sideguideId={sideguide.id}
                    decklistId={params.id}
                    matchupToEdit={editingMatchup}
                    onSaved={handleMatchupSaved}
                    onCancel={() => {
                      setShowNewMatchup(false)
                      setEditingMatchup(null)
                    }}
                  />
                ) : matchups.length === 0 ? (
                  <div className="text-center py-12 text-neutral-400">
                    <p className="mb-6">No matchup guides yet.</p>
                    <button
                      onClick={() => setShowNewMatchup(true)}
                      className="px-6 py-3 bg-gold-600 hover:bg-gold-700 text-white font-semibold rounded transition"
                    >
                      Create Your First Matchup
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {matchups.map((matchup) => (
                      <div
                        key={matchup.id}
                        className="p-4 bg-neutral-800 border border-neutral-700 rounded flex justify-between items-center hover:border-gold-600 transition"
                      >
                        <div>
                          <h3 className="font-semibold text-white">{matchup.matchup_name}</h3>
                          <p className="text-sm text-neutral-400">
                            {matchup.cards_in?.length || 0} in, {matchup.cards_out?.length || 0} out
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => setEditingMatchup(matchup)}
                            className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded transition"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteMatchup(matchup.id)}
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

              {matchups.length > 0 && !showNewMatchup && !editingMatchup && (
                <div className="flex gap-4">
                  <button
                    onClick={handleFinish}
                    className="flex-1 px-6 py-3 bg-gold-600 hover:bg-gold-700 text-white font-semibold rounded transition"
                  >
                    Finish & View Guide
                  </button>
                  {matchups.length < 20 && (
                    <button
                      onClick={() => setShowNewMatchup(true)}
                      className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded transition"
                    >
                      Add Another Matchup
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-6 sticky top-8">
                <h2 className="text-xl font-bold text-white mb-6">Progress</h2>

                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-neutral-400">Matchups</span>
                      <span className="font-bold text-gold-400">{matchups.length}/20</span>
                    </div>
                    <div className="w-full bg-neutral-800 rounded-full h-2">
                      <div
                        className="bg-gold-600 h-2 rounded-full transition-all"
                        style={{ width: `${(matchups.length / 20) * 100}%` }}
                      />
                    </div>
                  </div>

                  <div className="border-t border-neutral-800 pt-6">
                    <h3 className="font-semibold text-white mb-4">Deck Info</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-neutral-400">Format</span>
                        <span className="text-neutral-300 capitalize">{decklist.format}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-neutral-400">Created</span>
                        <span className="text-neutral-300">
                          {new Date(decklist.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-neutral-800 pt-6">
                    <p className="text-xs text-neutral-500">
                      You can add up to 20 matchup guides. Once you're done, click "Finish & View Guide" to publish.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
