export interface Item {
  title: string
  id: string
  content: string
}

export interface Group {
  title: string
  items: Item[]
}
