'use client'

interface Card {
  id: string
  name: string
  quantity: number
}

interface DeckBuilderProps {
  mainDeck: Card[]
  sideboard: Card[]
  onRemove: (cardId: string, isSideboard: boolean) => void
  onUpdateQuantity: (cardId: string, quantity: number, isSideboard: boolean) => void
}

export default function DeckBuilder({
  mainDeck,
  sideboard,
  onRemove,
  onUpdateQuantity,
}: DeckBuilderProps) {
  const mainDeckCount = mainDeck.reduce((acc, c) => acc + c.quantity, 0)
  const sideboardCount = sideboard.reduce((acc, c) => acc + c.quantity, 0)

  return (
    <div className="space-y-6">
      {/* Main Deck */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-6">
        <h3 className="text-xl font-bold text-gold-400 mb-4">
          Main Deck ({mainDeckCount})
        </h3>

        {mainDeck.length === 0 ? (
          <p className="text-neutral-500">No cards in main deck</p>
        ) : (
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {mainDeck.map((card) => (
              <div key={card.id} className="flex items-center justify-between p-2 hover:bg-neutral-800 rounded">
                <span className="text-neutral-300">{card.name}</span>
                <div className="flex items-center gap-3">
                  <select
                    value={card.quantity}
                    onChange={(e) =>
                      onUpdateQuantity(card.id, parseInt(e.target.value), false)
                    }
                    className="px-2 py-1 bg-neutral-800 border border-neutral-700 rounded text-white text-sm"
                  >
                    {[1, 2, 3, 4].map((q) => (
                      <option key={q} value={q}>
                        {q}x
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={() => onRemove(card.id, false)}
                    className="text-red-500 hover:text-red-400 font-bold"
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Sideboard */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-6">
        <h3 className="text-xl font-bold text-gold-400 mb-4">
          Sideboard ({sideboardCount})
        </h3>

        {sideboard.length === 0 ? (
          <p className="text-neutral-500">No cards in sideboard</p>
        ) : (
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {sideboard.map((card) => (
              <div key={card.id} className="flex items-center justify-between p-2 hover:bg-neutral-800 rounded">
                <span className="text-neutral-300">{card.name}</span>
                <div className="flex items-center gap-3">
                  <select
                    value={card.quantity}
                    onChange={(e) =>
                      onUpdateQuantity(card.id, parseInt(e.target.value), true)
                    }
                    className="px-2 py-1 bg-neutral-800 border border-neutral-700 rounded text-white text-sm"
                  >
                    {[1, 2, 3, 4].map((q) => (
                      <option key={q} value={q}>
                        {q}x
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={() => onRemove(card.id, true)}
                    className="text-red-500 hover:text-red-400 font-bold"
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
