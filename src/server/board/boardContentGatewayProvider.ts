import { Id } from 'shared/board/model'
import { BoardContentGateway } from 'server/board/boardContentGateway'
import { pgBoardContentGateway } from 'server/board/pgBoardContentGateway'

export async function boardContentGateway(userId: Id, boardId: Id): Promise<BoardContentGateway> {
  return pgBoardContentGateway(userId, boardId)
}