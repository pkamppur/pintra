import type { NextApiRequest, NextApiResponse } from 'next'
import { fetchBoard } from 'server/board/boardGateway'
import authenticatedRequest from 'server/authenticatedRequest'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  authenticatedRequest(req, res, async (username) => {
    const boardId = req.query.boardId as string
    console.log(`api ${username}: boardId: ${boardId}`)

    const board = await fetchBoard('userId', boardId)

    res.status(200).json(board)
  })
}
