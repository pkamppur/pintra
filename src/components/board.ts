import { Group } from './group'

export interface Board {
  name: string
  id: string
  groups: Group[]
}
