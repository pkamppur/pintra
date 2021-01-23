import type { NextApiRequest, NextApiResponse } from 'next'
import { fetchBoardContents } from 'server/board/boardGateway'
import authenticatedRequest from 'server/authenticatedRequest'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  await authenticatedRequest(req, res, async (username) => {
    const boardId = req.query.boardId as string

    const board = await fetchBoardContents('userId', boardId)

    res.status(200).json(board)
  })
}
