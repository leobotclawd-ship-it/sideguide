'use client'

import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { parseArenaDeck } from '@/lib/scryfall'
import CardSearcher from '@/components/CardSearcher'

export default function CreatePage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [deckName, setDeckName] = useState('')
  const [format, setFormat] = useState('standard')
  const [mainDeck, setMainDeck] = useState<Array<{ id: string; name: string; quantity: number }>>([])
  const [sideboard, setSideboard] = useState<Array<{ id: string; name: string; quantity: number }>>([])
  const [importText, setImportText] = useState('')
  const [showImport, setShowImport] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const formats = [
    { value: 'standard', label: 'Standard' },
    { value: 'pioneer', label: 'Pioneer' },
    { value: 'modern', label: 'Modern' },
    { value: 'legacy', label: 'Legacy' },
    { value: 'vintage', label: 'Vintage' },
    { value: 'commander', label: 'Commander' },
  ]

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession()

    if (!session) {
      router.push('/auth/login')
      return
    }

    setUser(session.user)
    setLoading(false)
  }

  const addCard = (cardName: string, isSideboard: boolean = false) => {
    const trimmedName = cardName.trim()
    if (!trimmedName) return

    const deck = isSideboard ? sideboard : mainDeck
    const setDeck = isSideboard ? setSideboard : setMainDeck

    const existing = deck.find((c) => c.name.toLowerCase() === trimmedName.toLowerCase())

    if (existing && existing.quantity < 4) {
      setDeck(
        deck.map((c) =>
          c.id === existing.id
            ? { ...c, quantity: Math.min(c.quantity + 1, 4) }
            : c
        )
      )
    } else if (!existing) {
      setDeck([
        ...deck,
        {
          id: `${trimmedName}-${Date.now()}`,
          name: trimmedName,
          quantity: 1,
        },
      ])
    }
  }

  const removeCard = (cardId: string, isSideboard: boolean) => {
    const setDeck = isSideboard ? setSideboard : setMainDeck
    const deck = isSideboard ? sideboard : mainDeck
    setDeck(deck.filter((c) => c.id !== cardId))
  }

  const updateQuantity = (cardId: string, quantity: number, isSideboard: boolean) => {
    const setDeck = isSideboard ? setSideboard : setMainDeck
    const deck = isSideboard ? sideboard : mainDeck

    if (quantity < 1) {
      removeCard(cardId, isSideboard)
      return
    }

    setDeck(
      deck.map((c) =>
        c.id === cardId ? { ...c, quantity: Math.min(quantity, 4) } : c
      )
    )
  }

  const handleImport = () => {
    setError(null)

    if (!importText.trim()) {
      setError('Please paste a decklist')
      return
    }

    try {
      const parsed = parseArenaDeck(importText)

      if (parsed.length === 0) {
        setError('Could not parse decklist. Use format: "4 Card Name"')
        return
      }

      // Clear current deck
      setMainDeck([])
      setSideboard([])

      // Add parsed cards (first 100 to main, rest to sideboard)
      parsed.forEach((card, idx) => {
        addCard(card.name, idx >= 60)
      })

      setShowImport(false)
      setImportText('')
    } catch (err) {
      setError('Error parsing decklist')
    }
  }

  const handleSave = async () => {
    if (!deckName.trim()) {
      setError('Please enter a deck name')
      return
    }

    if (mainDeck.length === 0) {
      setError('Please add cards to your deck')
      return
    }

    setSaving(true)
    setError(null)

    try {
      // Create decklist
      const { data: deckData, error: deckError } = await supabase
        .from('decklists')
        .insert({
          user_id: user.id,
          name: deckName,
          format,
          is_public: false,
        })
        .select()

      if (deckError) throw deckError

      const decklistId = deckData[0].id

      // Add cards
      const allCards = [
        ...mainDeck.map((c) => ({
          decklist_id: decklistId,
          card_name: c.name,
          quantity: c.quantity,
          is_sideboard: false,
        })),
        ...sideboard.map((c) => ({
          decklist_id: decklistId,
          card_name: c.name,
          quantity: c.quantity,
          is_sideboard: true,
        })),
      ]

      const { error: cardsError } = await supabase
        .from('decklist_cards')
        .insert(allCards)

      if (cardsError) throw cardsError

      // Create sideguide
      const { error: sideguideError } = await supabase
        .from('sideguides')
        .insert({
          decklist_id: decklistId,
        })

      if (sideguideError) throw sideguideError

      // Redirect to sideguide builder
      router.push(`/sideguide/${decklistId}`)
    } catch (err: any) {
      setError(err.message || 'Error saving deck')
    } finally {
      setSaving(false)
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

  const mainDeckCount = mainDeck.reduce((acc, c) => acc + c.quantity, 0)
  const sideboardCount = sideboard.reduce((acc, c) => acc + c.quantity, 0)

  return (
    <>
      <Header />
      <main className="min-h-screen bg-neutral-950">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <h1 className="text-4xl font-bold text-white mb-8">Create Decklist</h1>

          {error && (
            <div className="mb-6 p-4 bg-red-900/20 border border-red-800 rounded text-red-400">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Deck Info */}
            <div className="lg:col-span-2">
              <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-6 mb-8">
                <h2 className="text-2xl font-bold text-white mb-6">Deck Information</h2>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-neutral-300 mb-2">
                    Deck Name
                  </label>
                  <input
                    type="text"
                    value={deckName}
                    onChange={(e) => setDeckName(e.target.value)}
                    placeholder="e.g., Grixis Tempo"
                    className="w-full px-4 py-2 bg-neutral-800 border border-neutral-700 rounded text-white placeholder-neutral-500 focus:outline-none focus:border-gold-600 transition"
                  />
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-neutral-300 mb-2">
                    Format
                  </label>
                  <select
                    value={format}
                    onChange={(e) => setFormat(e.target.value)}
                    className="w-full px-4 py-2 bg-neutral-800 border border-neutral-700 rounded text-white focus:outline-none focus:border-gold-600 transition"
                  >
                    {formats.map((f) => (
                      <option key={f.value} value={f.value}>
                        {f.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={() => setShowImport(!showImport)}
                    className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded transition"
                  >
                    {showImport ? 'Cancel Import' : 'Import Decklist'}
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={saving || mainDeck.length === 0}
                    className="flex-1 px-4 py-2 bg-gold-600 hover:bg-gold-700 text-white font-semibold rounded transition disabled:opacity-50"
                  >
                    {saving ? 'Saving...' : 'Save & Build Sideguide'}
                  </button>
                </div>
              </div>

              {showImport && (
                <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-6 mb-8">
                  <h3 className="text-xl font-bold text-white mb-4">Import Decklist</h3>
                  <p className="text-sm text-neutral-400 mb-4">
                    Paste a decklist in MTG Arena format (one card per line: "4 Lightning Bolt")
                  </p>
                  <textarea
                    value={importText}
                    onChange={(e) => setImportText(e.target.value)}
                    placeholder="4 Lightning Bolt&#10;3 Counterspell&#10;2 Island"
                    className="w-full h-64 px-4 py-2 bg-neutral-800 border border-neutral-700 rounded text-white placeholder-neutral-500 focus:outline-none focus:border-gold-600 transition font-mono text-sm"
                  />
                  <button
                    onClick={handleImport}
                    className="w-full mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded transition"
                  >
                    Import
                  </button>
                </div>
              )}

              {/* Card Searcher */}
              <CardSearcher onAddCard={(name) => addCard(name, false)} />
            </div>

            {/* Deck Preview */}
            <div className="lg:col-span-1">
              <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-6 sticky top-8">
                <h2 className="text-2xl font-bold text-white mb-6">Deck Preview</h2>

                <div className="space-y-6">
                  {/* Main Deck */}
                  <div>
                    <h3 className="text-lg font-semibold text-gold-400 mb-3">
                      Main Deck ({mainDeckCount})
                    </h3>
                    {mainDeck.length === 0 ? (
                      <p className="text-sm text-neutral-500">No cards yet</p>
                    ) : (
                      <div className="space-y-2 max-h-48 overflow-y-auto">
                        {mainDeck.map((card) => (
                          <div key={card.id} className="flex justify-between items-center text-sm">
                            <span className="text-neutral-300">
                              {card.quantity}x {card.name}
                            </span>
                            <button
                              onClick={() => removeCard(card.id, false)}
                              className="text-red-500 hover:text-red-400 text-xs"
                            >
                              ✕
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Sideboard */}
                  <div>
                    <h3 className="text-lg font-semibold text-gold-400 mb-3">
                      Sideboard ({sideboardCount})
                    </h3>
                    {sideboard.length === 0 ? (
                      <p className="text-sm text-neutral-500">No cards yet</p>
                    ) : (
                      <div className="space-y-2 max-h-48 overflow-y-auto">
                        {sideboard.map((card) => (
                          <div key={card.id} className="flex justify-between items-center text-sm">
                            <span className="text-neutral-300">
                              {card.quantity}x {card.name}
                            </span>
                            <button
                              onClick={() => removeCard(card.id, true)}
                              className="text-red-500 hover:text-red-400 text-xs"
                            >
                              ✕
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
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
