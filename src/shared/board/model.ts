export interface BoardWithGroups {
  name: string
  id: string
  groups: Group[]
}

export type Id = string

export interface Board {
  name: string
  id: Id
}

export interface Item {
  title: string
  id: string
  content: string
}

export interface Group {
  title: string
  items: Item[]
}
