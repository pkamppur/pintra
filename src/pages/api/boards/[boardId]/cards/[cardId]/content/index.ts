import type { NextApiRequest, NextApiResponse } from 'next'
import { fetchCardContent } from 'server/board/boardGateway'
import authenticatedRequest from 'server/authenticatedRequest'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  authenticatedRequest(req, res, async (username) => {
    const boardId = req.query.boardId as string
    const cardId = req.query.cardId as string
    const cardContent = await fetchCardContent(boardId, cardId)

    res.status(200).json(cardContent)
  })
}
