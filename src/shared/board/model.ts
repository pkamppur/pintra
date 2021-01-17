export type Id = string

export interface Board {
  name: string
  id: Id
}

export interface Card {
  title: string
  id: string
  content: string
}

export interface Section {
  name: string
  cards: Card[]
}
