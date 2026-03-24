'use client'

import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

interface PageProps {
  params: {
    id: string
  }
}

export default function GuidePage({ params }: PageProps) {
  const [guide, setGuide] = useState<any>(null)
  const [decklist, setDecklist] = useState<any[]>([])
  const [sideboard, setSideboard] = useState<any[]>([])
  const [matchups, setMatchups] = useState<any[]>([])
  const [activeMatchup, setActiveMatchup] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchGuideData()
  }, [params.id])

  const fetchGuideData = async () => {
    try {
      // Fetch decklist
      const { data: guideData, error: guideError } = await supabase
        .from('decklists')
        .select('*')
        .eq('id', params.id)
        .single()

      if (guideError) throw guideError
      setGuide(guideData)

      // Fetch decklist cards
      const { data: cardsData, error: cardsError } = await supabase
        .from('decklist_cards')
        .select('*')
        .eq('decklist_id', params.id)

      if (cardsError) throw cardsError

      const main = cardsData?.filter((c) => !c.is_sideboard) || []
      const side = cardsData?.filter((c) => c.is_sideboard) || []

      setDecklist(main)
      setSideboard(side)

      // Fetch sideguides and matchups
      const { data: sideguideData, error: sideguideError } = await supabase
        .from('sideguides')
        .select('*')
        .eq('decklist_id', params.id)

      if (sideguideError) throw sideguideError

      if (sideguideData && sideguideData.length > 0) {
        const { data: matchupData, error: matchupError } = await supabase
          .from('sideguide_matchups')
          .select('*')
          .eq('sideguide_id', sideguideData[0].id)

        if (matchupError) throw matchupError
        setMatchups(matchupData || [])
        if (matchupData && matchupData.length > 0) {
          setActiveMatchup(matchupData[0])
        }
      }
    } catch (err) {
      console.error('Error fetching guide data:', err)
    } finally {
      setLoading(false)
    }
  }

  const mainDeckCount = decklist.reduce((acc, card) => acc + card.quantity, 0)
  const sideboardCount = sideboard.reduce((acc, card) => acc + card.quantity, 0)

  if (loading) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-neutral-950 flex items-center justify-center">
          <p className="text-neutral-400">Loading guide...</p>
        </div>
        <Footer />
      </>
    )
  }

  if (!guide) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-neutral-950 flex items-center justify-center">
          <p className="text-neutral-400">Guide not found.</p>
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
          {/* Guide Header */}
          <div className="mb-12">
            <h1 className="text-5xl font-bold text-white mb-4">{guide.name}</h1>
            <p className="text-lg text-neutral-400">
              Format: <span className="text-neutral-300 capitalize font-semibold">{guide.format}</span>
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Decklist Section */}
            <div className="lg:col-span-1">
              <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-6">
                <h2 className="text-2xl font-bold text-white mb-6">Decklist</h2>

                {/* Main Deck */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gold-400 mb-4">
                    Main Deck ({mainDeckCount})
                  </h3>
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {decklist.map((card) => (
                      <div
                        key={card.id}
                        className="flex justify-between text-sm text-neutral-300"
                      >
                        <span>{card.quantity}x {card.card_name}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Sideboard */}
                <div>
                  <h3 className="text-lg font-semibold text-gold-400 mb-4">
                    Sideboard ({sideboardCount})
                  </h3>
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {sideboard.map((card) => (
                      <div
                        key={card.id}
                        className="flex justify-between text-sm text-neutral-300"
                      >
                        <span>{card.quantity}x {card.card_name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Matchups Section */}
            <div className="lg:col-span-2">
              {matchups.length === 0 ? (
                <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-6 text-center text-neutral-400">
                  No matchup guides yet.
                </div>
              ) : (
                <div>
                  {/* Matchup Tabs */}
                  <div className="flex flex-wrap gap-2 mb-6 pb-4 border-b border-neutral-800">
                    {matchups.map((matchup) => (
                      <button
                        key={matchup.id}
                        onClick={() => setActiveMatchup(matchup)}
                        className={`px-4 py-2 rounded transition ${
                          activeMatchup?.id === matchup.id
                            ? 'bg-gold-600 text-white'
                            : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
                        }`}
                      >
                        {matchup.matchup_name}
                      </button>
                    ))}
                  </div>

                  {/* Active Matchup Details */}
                  {activeMatchup && (
                    <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-6">
                      <h3 className="text-2xl font-bold text-white mb-6">
                        {activeMatchup.matchup_name}
                      </h3>

                      <div className="grid grid-cols-2 gap-6 mb-8">
                        {/* Cards In */}
                        <div>
                          <h4 className="text-lg font-semibold text-green-400 mb-4">
                            Cards In
                          </h4>
                          <div className="space-y-2">
                            {activeMatchup.cards_in?.length > 0 ? (
                              activeMatchup.cards_in.map((card: any, idx: number) => (
                                <div key={idx} className="text-sm text-neutral-300">
                                  {card.quantity}x {card.card_name}
                                </div>
                              ))
                            ) : (
                              <p className="text-sm text-neutral-500">No cards</p>
                            )}
                          </div>
                        </div>

                        {/* Cards Out */}
                        <div>
                          <h4 className="text-lg font-semibold text-red-400 mb-4">
                            Cards Out
                          </h4>
                          <div className="space-y-2">
                            {activeMatchup.cards_out?.length > 0 ? (
                              activeMatchup.cards_out.map((card: any, idx: number) => (
                                <div key={idx} className="text-sm text-neutral-300">
                                  {card.quantity}x {card.card_name}
                                </div>
                              ))
                            ) : (
                              <p className="text-sm text-neutral-500">No cards</p>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Notes */}
                      {activeMatchup.notes && (
                        <div className="bg-neutral-800 rounded p-4">
                          <h4 className="font-semibold text-white mb-2">Notes</h4>
                          <p className="text-neutral-300 whitespace-pre-wrap">
                            {activeMatchup.notes}
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Print Button */}
          {matchups.length > 0 && (
            <div className="mt-8 text-center">
              <button
                onClick={() => window.print()}
                className="px-6 py-3 bg-gold-600 hover:bg-gold-700 text-white font-semibold rounded-lg transition"
              >
                Print Sideguide (A4)
              </button>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}
