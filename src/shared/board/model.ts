export type Id = string

export interface Board {
  id: Id
  version: number

  name: string
}

export interface Section {
  id: string
  version: number

  name: string
  cards: Card[]
}

export interface Card {
  id: string
  version: number

  name: string
  content: string
}
