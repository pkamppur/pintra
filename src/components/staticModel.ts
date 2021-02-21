import { Card, CardContent } from '../shared/board/model'

export interface StaticBoardContent {
  name: string
  sections: StaticSection[]

  styles: BoardStyles
}

export interface BoardStyles {
  textColor?: string
  backgroundColor?: string
  backgroundImage?: string
  background?: string
}

export interface StaticSection {
  id: string

  name: string
  cards: StaticCard[]

  textColor?: string
  backgroundColor?: string
}

export interface StaticCard extends Card, CardContent {}
