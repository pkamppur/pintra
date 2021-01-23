export type Id = string

export interface Board {
  id: Id
  version: number

  name: string

  textColor?: string
  backgroundColor?: string
}

export interface BoardContent {
  id: Id
  version: number

  name: string
  sections: Section[]

  textColor?: string
  backgroundColor?: string
}

export interface Section {
  id: string
  version: number

  name: string
  cards: Card[]

  textColor?: string
  backgroundColor?: string
}

export interface Card {
  id: string
  version: number

  name: string
}

export interface CardContent {
  content: string
}
