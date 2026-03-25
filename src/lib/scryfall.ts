export interface ScryfallCard {
  id: string
  name: string
  image_uris?: {
    normal: string
    large: string
    png: string
  }
  mana_cost?: string
  type_line?: string
  cmc?: number
  colors?: string[]
  object: string
}

// Search cards from Scryfall API
export async function searchCards(query: string): Promise<ScryfallCard[]> {
  try {
    const response = await fetch(
      `https://api.scryfall.com/cards/autocomplete?q=${encodeURIComponent(query)}`
    )
    if (!response.ok) throw new Error('Scryfall API error')
    
    const data = await response.json()
    return data.data || []
  } catch (error) {
    console.error('Error searching cards:', error)
    return []
  }
}

// Get card details from Scryfall
export async function getCardDetails(cardName: string): Promise<ScryfallCard | null> {
  try {
    const response = await fetch(
      `https://api.scryfall.com/cards/named?exact=${encodeURIComponent(cardName)}`
    )
    if (!response.ok) return null
    
    return await response.json()
  } catch (error) {
    console.error('Error fetching card details:', error)
    return null
  }
}

// Fuzzy search for cards
export async function fuzzySearchCards(query: string): Promise<ScryfallCard[]> {
  try {
    const response = await fetch(
      `https://api.scryfall.com/cards/search?q=${encodeURIComponent(query)}&unique=cards&order=released&dir=desc&format=json`
    )
    if (!response.ok) return []
    
    const data = await response.json()
    return data.data || []
  } catch (error) {
    console.error('Error fuzzy searching cards:', error)
    return []
  }
}

// Parse MTG Arena format (e.g., "4 Lightning Bolt")
export function parseArenaDeck(deckText: string): Array<{ name: string; quantity: number }> {
  const lines = deckText.split('\n').filter((line) => line.trim())
  const cards: Array<{ name: string; quantity: number }> = []

  for (const line of lines) {
    const match = line.match(/^(\d+)\s+(.+)$/)
    if (match) {
      const quantity = parseInt(match[1], 10)
      const name = match[2].trim()
      
      if (quantity > 0 && quantity <= 4 && name) {
        cards.push({ name, quantity })
      }
    }
  }

  return cards
}

// Parse .dek format (same as Arena)
export function parseDekFormat(deckText: string): Array<{ name: string; quantity: number }> {
  return parseArenaDeck(deckText)
}
