'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

interface CardWithQuantity {
  card_name: string
  quantity: number
}

interface MatchupFormProps {
  sideguideId: string
  decklistId: string
  matchupToEdit?: any
  onSaved: () => void
  onCancel: () => void
}

export default function MatchupForm({
  sideguideId,
  decklistId,
  matchupToEdit,
  onSaved,
  onCancel,
}: MatchupFormProps) {
  const [step, setStep] = useState<'name' | 'in' | 'out' | 'notes'>(
    matchupToEdit ? 'in' : 'name'
  )
  const [matchupName, setMatchupName] = useState(matchupToEdit?.matchup_name || '')
  const [mainDeck, setMainDeck] = useState<any[]>([])
  const [sideboard, setSideboard] = useState<any[]>([])
  const [selectedCardsIn, setSelectedCardsIn] = useState<Set<string>>(
    new Set(matchupToEdit?.cards_in?.map((c: any) => c.card_name) || [])
  )
  const [selectedCardsOut, setSelectedCardsOut] = useState<Set<string>>(
    new Set(matchupToEdit?.cards_out?.map((c: any) => c.card_name) || [])
  )
  const [notes, setNotes] = useState(matchupToEdit?.notes || '')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchDeckCards()
  }, [decklistId])

  const fetchDeckCards = async () => {
    try {
      const { data, error } = await supabase
        .from('decklist_cards')
        .select('*')
        .eq('decklist_id', decklistId)

      if (error) throw error

      const main = data?.filter((c) => !c.is_sideboard) || []
      const side = data?.filter((c) => c.is_sideboard) || []

      setMainDeck(main)
      setSideboard(side)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const toggleCardIn = (cardName: string) => {
    const newSet = new Set(selectedCardsIn)
    if (newSet.has(cardName)) {
      newSet.delete(cardName)
    } else {
      newSet.add(cardName)
    }
    setSelectedCardsIn(newSet)
  }

  const toggleCardOut = (cardName: string) => {
    const newSet = new Set(selectedCardsOut)
    if (newSet.has(cardName)) {
      newSet.delete(cardName)
    } else {
      newSet.add(cardName)
    }
    setSelectedCardsOut(newSet)
  }

  const handleSave = async () => {
    if (!matchupName.trim()) {
      setError('Please enter a matchup name')
      return
    }

    const cardsInArray = sideboard.filter((c) => selectedCardsIn.has(c.card_name))
    const cardsOutArray = mainDeck.filter((c) => selectedCardsOut.has(c.card_name))

    setSaving(true)
    setError(null)

    try {
      if (matchupToEdit) {
        // Update existing matchup
        const { error } = await supabase
          .from('sideguide_matchups')
          .update({
            matchup_name: matchupName,
            cards_in: cardsInArray.map((c) => ({
              card_name: c.card_name,
              quantity: c.quantity,
            })),
            cards_out: cardsOutArray.map((c) => ({
              card_name: c.card_name,
              quantity: c.quantity,
            })),
            notes,
          })
          .eq('id', matchupToEdit.id)

        if (error) throw error
      } else {
        // Create new matchup
        const { error } = await supabase
          .from('sideguide_matchups')
          .insert({
            sideguide_id: sideguideId,
            matchup_name: matchupName,
            cards_in: cardsInArray.map((c) => ({
              card_name: c.card_name,
              quantity: c.quantity,
            })),
            cards_out: cardsOutArray.map((c) => ({
              card_name: c.card_name,
              quantity: c.quantity,
            })),
            notes,
          })

        if (error) throw error
      }

      onSaved()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <div className="text-neutral-400">Loading deck cards...</div>
  }

  return (
    <div className="bg-neutral-800 border border-neutral-700 rounded-lg p-6 mb-6">
      {/* Step: Matchup Name */}
      {step === 'name' && (
        <div>
          <h3 className="text-xl font-bold text-white mb-6">What's the matchup?</h3>
          <input
            type="text"
            value={matchupName}
            onChange={(e) => setMatchupName(e.target.value)}
            placeholder="e.g., Mono Red, Dimir Control"
            className="w-full px-4 py-3 bg-neutral-700 border border-neutral-600 rounded text-white placeholder-neutral-500 focus:outline-none focus:border-gold-600 transition mb-6"
            autoFocus
          />
          <div className="flex gap-4">
            <button
              onClick={() => setStep('in')}
              disabled={!matchupName.trim()}
              className="flex-1 px-4 py-2 bg-gold-600 hover:bg-gold-700 text-white font-semibold rounded transition disabled:opacity-50"
            >
              Next
            </button>
            <button
              onClick={onCancel}
              className="flex-1 px-4 py-2 bg-neutral-700 hover:bg-neutral-600 text-white font-semibold rounded transition"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Step: Cards In */}
      {step === 'in' && (
        <div>
          <h3 className="text-xl font-bold text-white mb-2">Which sideboard cards enter?</h3>
          <p className="text-sm text-neutral-400 mb-6">Select cards from your sideboard</p>

          {error && (
            <div className="mb-4 p-3 bg-red-900/20 border border-red-800 rounded text-red-400 text-sm">
              {error}
            </div>
          )}

          {sideboard.length === 0 ? (
            <div className="text-neutral-400 py-8 text-center">
              No sideboard cards found
            </div>
          ) : (
            <div className="space-y-2 max-h-64 overflow-y-auto mb-6">
              {sideboard.map((card) => (
                <label
                  key={card.id}
                  className="flex items-center p-3 bg-neutral-700 hover:bg-neutral-600 rounded cursor-pointer transition"
                >
                  <input
                    type="checkbox"
                    checked={selectedCardsIn.has(card.card_name)}
                    onChange={() => toggleCardIn(card.card_name)}
                    className="w-4 h-4"
                  />
                  <span className="ml-3 text-white flex-1">
                    {card.quantity}x {card.card_name}
                  </span>
                </label>
              ))}
            </div>
          )}

          <div className="flex gap-4">
            <button
              onClick={() => setStep('out')}
              className="flex-1 px-4 py-2 bg-gold-600 hover:bg-gold-700 text-white font-semibold rounded transition"
            >
              Next: Cards Out
            </button>
            <button
              onClick={() => setStep('name')}
              className="flex-1 px-4 py-2 bg-neutral-700 hover:bg-neutral-600 text-white font-semibold rounded transition"
            >
              Back
            </button>
          </div>
        </div>
      )}

      {/* Step: Cards Out */}
      {step === 'out' && (
        <div>
          <h3 className="text-xl font-bold text-white mb-2">Which main deck cards exit?</h3>
          <p className="text-sm text-neutral-400 mb-6">Select cards from your main deck to remove</p>

          {mainDeck.length === 0 ? (
            <div className="text-neutral-400 py-8 text-center">
              No main deck cards found
            </div>
          ) : (
            <div className="space-y-2 max-h-64 overflow-y-auto mb-6">
              {mainDeck.map((card) => (
                <label
                  key={card.id}
                  className="flex items-center p-3 bg-neutral-700 hover:bg-neutral-600 rounded cursor-pointer transition"
                >
                  <input
                    type="checkbox"
                    checked={selectedCardsOut.has(card.card_name)}
                    onChange={() => toggleCardOut(card.card_name)}
                    className="w-4 h-4"
                  />
                  <span className="ml-3 text-white flex-1">
                    {card.quantity}x {card.card_name}
                  </span>
                </label>
              ))}
            </div>
          )}

          <div className="flex gap-4">
            <button
              onClick={() => setStep('notes')}
              className="flex-1 px-4 py-2 bg-gold-600 hover:bg-gold-700 text-white font-semibold rounded transition"
            >
              Next: Add Notes
            </button>
            <button
              onClick={() => setStep('in')}
              className="flex-1 px-4 py-2 bg-neutral-700 hover:bg-neutral-600 text-white font-semibold rounded transition"
            >
              Back
            </button>
          </div>
        </div>
      )}

      {/* Step: Notes */}
      {step === 'notes' && (
        <div>
          <h3 className="text-xl font-bold text-white mb-2">Strategy notes</h3>
          <p className="text-sm text-neutral-400 mb-6">Add tips and strategy for this matchup (optional)</p>

          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="e.g., Mulligan aggressively for early interaction. Watch for board wipes."
            className="w-full h-32 px-4 py-3 bg-neutral-700 border border-neutral-600 rounded text-white placeholder-neutral-500 focus:outline-none focus:border-gold-600 transition mb-6"
          />

          <div className="flex gap-4">
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex-1 px-4 py-2 bg-gold-600 hover:bg-gold-700 text-white font-semibold rounded transition disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save Matchup'}
            </button>
            <button
              onClick={() => setStep('out')}
              className="flex-1 px-4 py-2 bg-neutral-700 hover:bg-neutral-600 text-white font-semibold rounded transition"
            >
              Back
            </button>
            <button
              onClick={onCancel}
              className="flex-1 px-4 py-2 bg-neutral-700 hover:bg-neutral-600 text-white font-semibold rounded transition"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
