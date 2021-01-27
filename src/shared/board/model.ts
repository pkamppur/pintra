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

  styles: BoardStyles
}

export interface BoardStyles {
  textColor?: string
  backgroundColor?: string
  backgroundImage?: string
  background?: string
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
  tags: Tag[]
}

export interface Tag {
  id: string
  name: string
}

export interface CardContent {
  content: string
}
