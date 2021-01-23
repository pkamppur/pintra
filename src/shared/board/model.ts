export type Id = string

export interface Board {
  id: Id
  version: number

  name: string
}

export interface BoardContent {
  id: Id
  version: number

  name: string
  sections: Section[]
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
}

export interface CardContent {
  content: string
}
