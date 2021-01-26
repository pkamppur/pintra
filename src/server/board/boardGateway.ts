import { PoolClient } from 'pg'
import short from 'short-uuid'
import { withDB as _withDB } from 'server/db'
import { Board, Id } from 'shared/board/model'
export async function fetchBoards(userId: Id): Promise<Board[]> {
  // Disabled for privacy/security. One credential for now, so don't want to leak all boards to everyone sharing the same credentials.
  // return await withDB((db) => boardsFromDb(db))
  return []
}
