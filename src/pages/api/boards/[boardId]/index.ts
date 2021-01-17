import type { NextApiRequest, NextApiResponse } from 'next'
import { fetchBoard } from 'server/board/boardGateway'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const boardId = req.query.boardId as string
  console.log(`api boardId: ${boardId}`)
  const board = await fetchBoard('userId', boardId)

  res.status(200).json(board)
}
