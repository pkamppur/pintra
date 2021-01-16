import { withDBClient } from 'db'
import { Board, Id } from 'components/board/model'

const boards: Map<Id, Board> = new Map()

export async function fetchBoard(userId: Id, id: Id): Promise<Board> {
  const board = boards.get(id)
  if (board) {
    return board
  }

  const result = await withDBClient((client) => client.query('SELECT name, id FROM board WHERE id=$1', [id]))

  if (result.rows.length == 0) {
    throw Error(`Board ${id} not found`)
  } else {
    const loadedBoard: Board = result.rows[0]
    boards.set(loadedBoard.id, loadedBoard)
    return loadedBoard
  }
}
