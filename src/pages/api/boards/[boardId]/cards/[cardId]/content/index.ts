import type { NextApiRequest, NextApiResponse } from 'next'
import authenticatedRequest from 'server/authenticatedRequest'
import { boardContentGateway } from 'server/board/boardGatewayProvider'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  await authenticatedRequest(req, res, async (username) => {
    const boardId = req.query.boardId as string
    const cardId = req.query.cardId as string
    const gateway = await boardContentGateway(username, boardId)
    const cardContent = await gateway.fetchCardContent(cardId)

    res.status(200).json(cardContent)
  })
}
