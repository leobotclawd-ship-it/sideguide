'use client'

import { useState, useRef, useEffect } from 'react'
import { searchCards } from '@/lib/scryfall'

interface CardSearcherProps {
  onAddCard: (cardName: string) => void
}

export default function CardSearcher({ onAddCard }: CardSearcherProps) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [showDropdown, setShowDropdown] = useState(false)
  const debounceTimer = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (debounceTimer.current) clearTimeout(debounceTimer.current)

    if (query.length < 2) {
      setResults([])
      setShowDropdown(false)
      return
    }

    setLoading(true)

    debounceTimer.current = setTimeout(async () => {
      try {
        const cards = await searchCards(query)
        setResults(cards.slice(0, 10))
        setShowDropdown(true)
      } catch (err) {
        console.error('Error searching cards:', err)
        setResults([])
      } finally {
        setLoading(false)
      }
    }, 300)

    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current)
    }
  }, [query])

  const handleSelectCard = (cardName: string) => {
    onAddCard(cardName)
    setQuery('')
    setResults([])
    setShowDropdown(false)
  }

  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-6">
      <h2 className="text-2xl font-bold text-white mb-6">Add Cards</h2>

      <div className="relative mb-6">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setShowDropdown(true)}
          placeholder="Search for a card..."
          className="w-full px-4 py-2 bg-neutral-800 border border-neutral-700 rounded text-white placeholder-neutral-500 focus:outline-none focus:border-gold-600 transition"
        />

        {loading && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 text-sm">
            Searching...
          </div>
        )}

        {showDropdown && results.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-neutral-800 border border-neutral-700 rounded-lg z-10 max-h-64 overflow-y-auto">
            {results.map((card, idx) => (
              <button
                key={idx}
                onClick={() => handleSelectCard(card)}
                className="w-full text-left px-4 py-3 hover:bg-neutral-700 transition text-neutral-300 hover:text-white border-b border-neutral-700 last:border-b-0"
              >
                {card}
              </button>
            ))}
          </div>
        )}

        {showDropdown && query.length >= 2 && results.length === 0 && !loading && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-neutral-800 border border-neutral-700 rounded-lg p-4 text-neutral-400 text-sm z-10">
            No cards found
          </div>
        )}
      </div>

      <p className="text-sm text-neutral-400">
        Type a card name to search the Scryfall database. Cards will be added with quantity 1.
      </p>
    </div>
  )
}
