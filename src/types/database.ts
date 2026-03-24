export interface Decklist {
  id: string
  user_id: string
  name: string
  format: string
  is_public: boolean
  created_at: string
  updated_at: string
}

export interface DecklistCard {
  id: string
  decklist_id: string
  card_name: string
  quantity: number
  is_sideboard: boolean
  created_at: string
}

export interface Sideguide {
  id: string
  decklist_id: string
  created_at: string
  updated_at: string
}

export interface CardSwap {
  card_name: string
  quantity: number
}

export interface SideguideMatchup {
  id: string
  sideguide_id: string
  matchup_name: string
  notes: string | null
  cards_in: CardSwap[]
  cards_out: CardSwap[]
  created_at: string
}

export interface MTGCard {
  name: string
  image_uris?: {
    normal: string
    large: string
    png: string
  }
  mana_cost?: string
  type_line?: string
}
